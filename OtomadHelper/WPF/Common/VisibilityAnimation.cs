/// <summary>
/// <see href="https://www.codeproject.com/Articles/57175/WPF-How-To-Animate-Visibility-Property" />
/// </summary>

using System.Windows.Media.Animation;
using System.Windows;
using System.Windows.Data;

namespace OtomadHelper.WPF.Common;

/// <summary>
/// Supplies attached properties that provides visibility of animations
/// </summary>
[AttachedDependencyProperty<AnimationType, FrameworkElement>("AnimationType", DefaultValue = AnimationType.None,
	Description = "Using a DependencyProperty as the backing store for AnimationType.\nThis enables animation, styling, binding, etc...")]
public static partial class VisibilityAnimation {
	public enum AnimationType {
		/// <summary>
		/// No animation
		/// </summary>
		None,

		/// <summary>
		/// Fade in / Fade out
		/// </summary>
		Fade,
	}

	/// <summary>
	/// Animation duration
	/// </summary>
	private const int AnimationDuration = 300;

	/// <summary>
	/// List of hooked objects
	/// </summary>
	private static readonly Dictionary<FrameworkElement, bool> hookedElements = [];

	/// <summary>
	/// AnimationType property changed
	/// </summary>
	static partial void OnAnimationTypeChanged(FrameworkElement frameworkElement, AnimationType oldValue, AnimationType newValue) {
		// If AnimationType is set to True on this framework element,
		if (GetAnimationType(frameworkElement) != AnimationType.None) {
			// Add this framework element to hooked list
			HookVisibilityChanges(frameworkElement);
		} else {
			// Otherwise, remove it from the hooked list
			UnHookVisibilityChanges(frameworkElement);
		}
	}

	/// <summary>
	/// Add framework element to list of hooked objects
	/// </summary>
	/// <param name="frameworkElement">Framework element</param>
	private static void HookVisibilityChanges(FrameworkElement frameworkElement) =>
		hookedElements.Add(frameworkElement, false);

	/// <summary>
	/// Remove framework element from list of hooked objects
	/// </summary>
	/// <param name="frameworkElement">Framework element</param>
	private static void UnHookVisibilityChanges(FrameworkElement frameworkElement) {
		if (hookedElements.ContainsKey(frameworkElement))
			hookedElements.Remove(frameworkElement);
	}

	/// <summary>
	/// VisibilityAnimation static ctor
	/// </summary>
	static VisibilityAnimation() {
		// Here we "register" on Visibility property "before change" event
		UIElement.VisibilityProperty.AddOwner(
			typeof(FrameworkElement),
			new FrameworkPropertyMetadata(
				Visibility.Visible,
				VisibilityChanged,
				CoerceVisibility
			)
		);
	}

	/// <summary>
	/// Visibility changed
	/// </summary>
	/// <param name="dependencyObject">Dependency object</param>
	/// <param name="e">e</param>
	private static void VisibilityChanged(
		DependencyObject dependencyObject,
		DependencyPropertyChangedEventArgs e) {
		// Ignore
	}

	/// <summary>
	/// Coerce visibility
	/// </summary>
	/// <param name="dependencyObject">Dependency object</param>
	/// <param name="baseValue">Base value</param>
	/// <returns>Coerced value</returns>
	private static object CoerceVisibility(DependencyObject dependencyObject, object baseValue) {
		// Make sure object is a framework element
		if (dependencyObject is not FrameworkElement frameworkElement) return baseValue;

		// Cast to type safe value
		Visibility visibility = (Visibility)baseValue;

		// If Visibility value hasn't change, do nothing.
		// This can happen if the Visibility property is set using data binding
		// and the binding source has changed but the new visibility value
		// hasn't changed.
		if (visibility == frameworkElement.Visibility) return baseValue;

		// If element is not hooked by our attached property, stop here
		if (!IsHookedElement(frameworkElement)) return baseValue;

		// Update animation flag
		// If animation already started, don't restart it (otherwise, infinite loop)
		if (UpdateAnimationStartedFlag(frameworkElement)) return baseValue;

		// If we get here, it means we have to start fade in or fade out animation.
		// In any case return value of this method will be Visibility.Visible,
		// to allow the animation.
		DoubleAnimation doubleAnimation = new() {
			Duration = new Duration(TimeSpan.FromMilliseconds(AnimationDuration)),
		};

		// When animation completes, set the visibility value to the requested
		// value (baseValue)
		doubleAnimation.Completed += (sender, eventArgs) => {
			if (visibility == Visibility.Visible) {
				// In case we change into Visibility.Visible, the correct value
				// is already set, so just update the animation started flag
				UpdateAnimationStartedFlag(frameworkElement);
			} else {
				// This will trigger value coercion again
				// but UpdateAnimationStartedFlag() function will return true
				// this time, thus animation will not be triggered.
				if (BindingOperations.IsDataBound(frameworkElement, UIElement.VisibilityProperty)) {
					// Set visibility using bounded value
					Binding bindingValue = BindingOperations.GetBinding(frameworkElement, UIElement.VisibilityProperty);
					BindingOperations.SetBinding(frameworkElement, UIElement.VisibilityProperty, bindingValue);
				} else {
					// No binding, just assign the value
					frameworkElement.Visibility = visibility;
				}
			}
		};

		if (visibility is Visibility.Collapsed or Visibility.Hidden) {
			// Fade out by animating opacity
			doubleAnimation.From = 1d;
			doubleAnimation.To = 0d;
		} else {
			// Fade in by animating opacity
			doubleAnimation.From = 0d;
			doubleAnimation.To = 1d;
		}

		// Start animation
		frameworkElement.BeginAnimation(UIElement.OpacityProperty, doubleAnimation);

		// Make sure the element remains visible during the animation
		// The original requested value will be set in the completed event of
		// the animation
		return Visibility.Visible;
	}

	/// <summary>
	/// Check if framework element is hooked with AnimationType property
	/// </summary>
	/// <param name="frameworkElement">Framework element to check</param>
	/// <returns>Is the framework element hooked?</returns>
	private static bool IsHookedElement(FrameworkElement frameworkElement) =>
		hookedElements.ContainsKey(frameworkElement);

	/// <summary>
	/// Update animation started flag or a given framework element
	/// </summary>
	/// <param name="frameworkElement">Given framework element</param>
	/// <returns>Old value of animation started flag</returns>
	private static bool UpdateAnimationStartedFlag(FrameworkElement frameworkElement) {
		bool animationStarted = hookedElements[frameworkElement];
		hookedElements[frameworkElement] = !animationStarted;

		return animationStarted;
	}
}
