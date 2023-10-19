const eases = {
	// #region 基本
	/// ### 线性
	/// 以相同速度开始至结束的过渡效果 `t`。
	linear: "cubic-bezier(0, 0, 1, 1)",
	/// ### 助跑线性
	/// 与线性效果几乎相同 `1t`。
	linearApproach: "cubic-bezier(0.25, 0.25, 0.75, 0.75)",
	/// ### 缓动
	/// 以慢速开始，然后变快，然后慢速结束的过渡效果。
	ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
	// #endregion

	// #region 缓入
	/// ### 缓入
	/// 以慢速开始的过渡效果。
	easeIn: "cubic-bezier(0.42, 0, 1, 1)",
	/// ### 二次缓入
	/// 二次方的缓动 `t²`。
	easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
	/// ### 三次缓入
	/// 三次方的缓动 `t³`。
	easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
	/// ### 四次缓入
	/// 四次方的缓动 `t⁴`。
	easeInQuart: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
	/// ### 五次缓入
	/// 五次方的缓动 `t⁵`。
	easeInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
	/// ### 正弦缓入
	/// 正弦曲线的缓动 `sin(t)`。
	easeInSine: "cubic-bezier(0.47, 0, 0.745, 0.715)",
	/// ### 指数缓入
	/// 指数曲线的缓动 `2ᵗ`。
	easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
	/// ### 圆形缓入
	/// 圆形曲线的缓动 `√(1-t²)`。
	easeInCirc: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
	/// ### 反弹缓入
	/// 超过范围的三次方缓动 `(s+1)t³St²`。
	easeInBack: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
	/// ### 最大缓入
	/// 将锚点拉到头的缓动 `3t^⅔-2t`。
	easeInMax: "cubic-bezier(1, 0, 1, 1)",
	/// ### 平滑缓入
	easeInSmooth: "cubic-bezier(0.6, 0, 1, 0.8)",
	// #endregion

	// #region 缓出
	/// ### 缓出
	/// 以慢速开始的过渡效果。
	easeOut: "cubic-bezier(0, 0, 0.58, 1)",
	/// ### 二次缓出
	/// 二次方的缓动 `t²`。
	easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
	/// ### 三次缓出
	/// 三次方的缓动 `t³`。
	easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
	/// ### 四次缓出
	/// 四次方的缓动 `t⁴`。
	easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
	/// ### 五次缓出
	/// 五次方的缓动 `t⁵`。
	easeOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
	/// ### 正弦缓出
	/// 正弦曲线的缓动 `sin(t)`。
	easeOutSine: "cubic-bezier(0.39, 0.575, 0.565, 1)",
	/// ### 指数缓出
	/// 指数曲线的缓动 `2ᵗ`。
	easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
	/// ### 圆形缓出
	/// 圆形曲线的缓动 `√(1-t²)`。
	easeOutCirc: "cubic-bezier(0.075, 0.82, 0.165, 1)",
	/// ### 反弹缓出
	/// 超过范围的三次方缓动 `(s+1)t³St²`。
	easeOutBack: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
	/// ### 最大缓出
	/// 将锚点拉到头的缓动 `3t^⅔-2t`。
	easeOutMax: "cubic-bezier(0, 0, 0, 1)",
	/// ### 平滑缓出
	easeOutSmooth: "cubic-bezier(0.1, 0.9, 0.2, 1)",
	// #endregion

	// #region 缓入缓出
	/// ### 缓入缓出
	/// 以慢速开始的过渡效果。
	easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
	/// ### 二次缓入缓出
	/// 二次方的缓动 `t²`。
	easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
	/// ### 三次缓入缓出
	/// 三次方的缓动 `t³`。
	easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
	/// ### 四次缓入缓出
	/// 四次方的缓动 `t⁴`。
	easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
	/// ### 五次缓入缓出
	/// 五次方的缓动 `t⁵`。
	easeInOutQuint: "cubic-bezier(0.86, 0, 0.07, 1)",
	/// ### 正弦缓入缓出
	/// 正弦曲线的缓动 `sin(t)`。
	easeInOutSine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
	/// ### 指数缓入缓出
	/// 指数曲线的缓动 `2ᵗ`。
	easeInOutExpo: "cubic-bezier(1, 0, 0, 1)",
	/// ### 圆形缓入缓出
	/// 圆形曲线的缓动 `√(1-t²)`。
	easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
	/// ### 反弹缓入缓出
	/// 超过范围的三次方缓动 `(s+1)t³St²`。
	easeInOutBack: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
	/// ### 最大缓入缓出
	/// 将锚点拉到头的缓动 `3t^⅔-2t`。
	easeInOutMax: "cubic-bezier(1, 0, 0, 1)",
	/// ### 平滑缓入缓出
	easeInOutSmooth: "cubic-bezier(0.75, 0, 0, 1)",
	// #endregion
};

export default eases;
