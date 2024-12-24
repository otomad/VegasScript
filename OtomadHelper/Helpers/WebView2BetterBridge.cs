/// <summary>
/// <see href="https://github.com/johot/WebView2-better-bridge"/>
/// </summary>

using System.Runtime.CompilerServices;

using OtomadHelper.Helpers.TupleAsJsonArray;
using OtomadHelper.Models;
using OtomadHelper.Module;

namespace OtomadHelper.Helpers.WebView2BetterBridge;

/// <summary>
/// Subscribers to messages from TS/JS and invokes methods / parses JSON etc for a wrapping bridge class.
/// Giving us the ability to use any arguments, use async methods pass complex objects etc.
/// </summary>
public class BetterBridge {
	// Will invoke methods on this object
	private readonly object bridgeClass;
	private readonly Type bridgeClassType;

	public BetterBridge(object bridgeClass) {
		this.bridgeClass = bridgeClass;
		bridgeClassType = this.bridgeClass.GetType();
	}

	internal static readonly JsonSerializerOptions jsonOptions = new() {
		PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
		IncludeFields = true,
		Converters = {
			new TupleConverterFactory(),
			new JsonStringEnumConverter(JsonNamingPolicy.CamelCase),
		},
	};

	public string[] GetMethods() =>
		bridgeClassType.GetMethods().Select(m => m.Name).ToArray();

	private static JsonValueKind GetJsonArgType(string jsonArg) {
		if (jsonArg == "null") return JsonValueKind.Null;
		else if (jsonArg.StartsWith("\"")) return JsonValueKind.String;
		else if (jsonArg == "true") return JsonValueKind.True;
		else if (jsonArg == "false") return JsonValueKind.False;
		else if (jsonArg.StartsWith("[")) return JsonValueKind.Array;
		else if (jsonArg.StartsWith("{")) return JsonValueKind.Object;
		else if (jsonArg.IsMatch(new(@"^[-.\d]"))) return JsonValueKind.Number;
		else return JsonValueKind.Undefined;
	}

	private static Type JsonTypeToCsType(JsonValueKind jsonType, Type unhandled = null!) => jsonType switch {
		JsonValueKind.String => typeof(string),
		JsonValueKind.Number => typeof(double), // What about int??
		JsonValueKind.True or JsonValueKind.False => typeof(bool),
		_ => unhandled, // Cannot handle them now.
	};

	/// <summary>
	/// Called from TS/JS side works on both async and regular methods of the wrapped class!
	/// </summary>
	/// <param name="methodName">The method name.</param>
	/// <param name="jsonArgsString">The method arguments but in JSON.</param>
	/// <param name="callId">Call ID.</param>
	/// <returns></returns>
	public async Task<string> RunMethod(string methodName, string jsonArgsString) {
		try {
			// We have stored each argument as json data in an array, the array is also encoded to a string
			// since webview can't invoke string[] array functions
			string[] jsonArgs = JsonSerializer.Deserialize<string[]>(jsonArgsString, jsonOptions) ??
				throw new TypeLoadException("Invalid arguments");
			for (int i = 0; i < jsonArgs.Length; i++)
				jsonArgs[i] = jsonArgs[i] is null ? "null" : jsonArgs[i];

			bool matchedMethodName = false, matchedParameterLength = false;
			MethodInfo[] methods = bridgeClassType.GetMethods();
			MethodInfo? method = methods.FirstOrDefault(method => {
				if (method.Name != methodName) return false;
				matchedMethodName = true;
				ParameterInfo[] parameters = method.GetParameters();
				int parametersLength = parameters.Length;
				if (parametersLength > jsonArgs.Length) // If the method contains optional parameters
					for (int i = parametersLength - 1; i >= 0 && parametersLength > jsonArgs.Length; i--)
						if (parameters[i].HasDefaultValue)
							parametersLength--;
				if (parametersLength != jsonArgs.Length) return false;
				matchedParameterLength = true;
				Dictionary<Type, JsonValueKind> genericParameters = [];
				for (int i = 0; i < parametersLength; i++) {
					ParameterInfo parameter = parameters[i];
					string jsonArg = jsonArgs[i].Trim();
					JsonValueKind jsonType = GetJsonArgType(jsonArg);
					Type type = parameter.ParameterType;
					if (type.IsGenericParameter) {
						if (jsonType is JsonValueKind.Null or JsonValueKind.Undefined) continue;
						if (genericParameters.TryGetValue(type, out JsonValueKind prevJsonType)) {
							if (prevJsonType != jsonType) return false;
							else continue;
						}
						genericParameters[type] = jsonType;
						continue;
					}
					if (jsonType is JsonValueKind.Null or JsonValueKind.Undefined or JsonValueKind.Object) continue;
					// Nulls and objects are temporarily unable to directly determine the correct type.
					if (type == typeof(string) && jsonType is JsonValueKind.String) continue;
					else if (type == typeof(bool) && jsonType is JsonValueKind.True or JsonValueKind.False) continue;
					else if ((type.Extends(typeof(IEnumerable)) || type.Extends(typeof(ITuple))) &&
						jsonType is JsonValueKind.Array) continue;
					else if (type.IsNumber() && jsonType is JsonValueKind.Number) continue;
					else return false;
				}
				return true;
			});

			if (method is null) {
				if (!matchedMethodName)
					throw new MissingMethodException(bridgeClassType.Name, methodName);
				else if (!matchedParameterLength)
					throw new ArgumentException($"No overload for method \"{methodName}\" takes {jsonArgs.Length} arguments");
				else
					throw new ArgumentException($"Method \"{methodName}\" contains overloads of {jsonArgs.Length} parameters, but the types are not matched");
			}

			ParameterInfo[] parameters = method.GetParameters();

			object?[] typedArgs = Enumerable.Repeat(Type.Missing, method.GetParameters().Length).ToArray();

			Dictionary<Type, Type> genericTypes = [];
			for (int i = 0; i < jsonArgs.Length; i++) {
				string jsonArg = jsonArgs[i];
				Type type = parameters[i].ParameterType;
				if (type.IsGenericParameter) {
					Type genericType = type;
					if (genericTypes.TryGetValue(genericType, out Type realType))
						type = realType;
					else {
						type = JsonTypeToCsType(GetJsonArgType(jsonArg), type);
						genericTypes[genericType] = type;
					}
				}
				if (type.GetElementType() is Type elementType && elementType.IsGenericParameter) {
					if (genericTypes.TryGetValue(elementType, out Type realType))
						type = realType.MakeArrayType();
					else {
						IEnumerable<string> items = jsonArg[1..^1].Split(',').Select(item => item.Trim());
						foreach (string item in items) {
							Type? _type = JsonTypeToCsType(GetJsonArgType(item));
							if (_type is not null) {
								type = _type.MakeArrayType();
								genericTypes[elementType] = _type;
								break;
							}
						}
					}
				}
				typedArgs[i] = JsonSerializer.Deserialize(jsonArg, type, jsonOptions);
			}

			if (method.IsGenericMethod) {
				Type[] generics = (Type[])method.GetGenericArguments().Clone();
				for (int i = 0; i < generics.Length; i++)
					if (genericTypes.TryGetValue(generics[i], out Type realType))
						generics[i] = realType;
				method = method.MakeGenericMethod(generics);
			}
			object resultTyped = method.Invoke(bridgeClass, typedArgs);

			// Was it an async method (in bridgeClass?)
			string resultJson;

			// Was the method called async?
			if (resultTyped is not Task resultTypedTask) { // Regular method
				// Package the result
				resultJson = JsonSerializer.Serialize(resultTyped, jsonOptions);
			} else { // Async method:
				await resultTypedTask;
				// If has a "Result" property return the value otherwise null (Task<void> etc)
				PropertyInfo resultProperty = resultTypedTask.GetType().GetProperty("Result");
				object? taskResult = resultProperty?.GetValue(resultTypedTask);

				// Package the result
				resultJson = JsonSerializer.Serialize(taskResult, jsonOptions);
			}

			return resultJson;
		} catch (Exception e) {
			PostWebMessage(new ConsoleLog(e.ToString(), "error"));
			return "null";
		}
	}

	[Obsolete("Use TupleConverterFactory instead.")]
	public static ITuple JsonDeserializeTuple(string arrayJson, Type tupleType) {
		// VEGAS environment (?) doesn't support JSON converters.
		// So we can't use some like: <a href="https://github.com/arogozine/TupleAsJsonArray">TupleAsJsonArray</a>.
		JsonNode? node = JsonNode.Parse(arrayJson);
		if (node?.GetValueKind() != JsonValueKind.Array)
			throw new ArrayTypeMismatchException("The specified JSON arg is not the array type");
		JsonArray array = node.AsArray();
		Type[] genericTupleArgs = tupleType.GetGenericArguments();
		object[] arguments = new object[genericTupleArgs.Length];
		for (int i = 0; i < genericTupleArgs.Length; i++) {
			Type type = genericTupleArgs[i];
			arguments[i] = JsonSerializer.Deserialize(array[i], type, jsonOptions)!;
		}
		return arguments.ToTuple(tupleType);
	}
}


