float blendColorDodge_14_0(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge_14_0(vec3 base, vec3 blend) {
	return vec3(blendColorDodge_14_0(base.r,blend.r),blendColorDodge_14_0(base.g,blend.g),blendColorDodge_14_0(base.b,blend.b));
}

vec3 blendColorDodge_14_0(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge_14_0(base, blend) * opacity + base * (1.0 - opacity));
}


float blendColorBurn_15_1(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn_15_1(vec3 base, vec3 blend) {
	return vec3(blendColorBurn_15_1(base.r,blend.r),blendColorBurn_15_1(base.g,blend.g),blendColorBurn_15_1(base.b,blend.b));
}

vec3 blendColorBurn_15_1(vec3 base, vec3 blend, float opacity) {
	return (blendColorBurn_15_1(base, blend) * opacity + base * (1.0 - opacity));
}


float blendVividLight_3_2(float base, float blend) {
	return (blend<0.5)?blendColorBurn_15_1(base,(2.0*blend)):blendColorDodge_14_0(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight_3_2(vec3 base, vec3 blend) {
	return vec3(blendVividLight_3_2(base.r,blend.r),blendVividLight_3_2(base.g,blend.g),blendVividLight_3_2(base.b,blend.b));
}

vec3 blendVividLight_3_2(vec3 base, vec3 blend, float opacity) {
	return (blendVividLight_3_2(base, blend) * opacity + base * (1.0 - opacity));
}



float blendHardMix_2_3(float base, float blend) {
	return (blendVividLight_3_2(base,blend)<0.5)?0.0:1.0;
}

vec3 blendHardMix_2_3(vec3 base, vec3 blend) {
	return vec3(blendHardMix_2_3(base.r,blend.r),blendHardMix_2_3(base.g,blend.g),blendHardMix_2_3(base.b,blend.b));
}

vec3 blendHardMix_2_3(vec3 base, vec3 blend, float opacity) {
	return (blendHardMix_2_3(base, blend) * opacity + base * (1.0 - opacity));
}



float blendLinearDodge_12_4(float base, float blend) {
	// Note : Same implementation as BlendAddf
	return min(base+blend,1.0);
}

vec3 blendLinearDodge_12_4(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendAdd
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge_12_4(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge_12_4(base, blend) * opacity + base * (1.0 - opacity));
}


float blendLinearBurn_13_5(float base, float blend) {
	// Note : Same implementation as BlendSubtractf
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn_13_5(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendSubtract
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn_13_5(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn_13_5(base, blend) * opacity + base * (1.0 - opacity));
}



float blendLinearLight_4_6(float base, float blend) {
	return blend<0.5?blendLinearBurn_13_5(base,(2.0*blend)):blendLinearDodge_12_4(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight_4_6(vec3 base, vec3 blend) {
	return vec3(blendLinearLight_4_6(base.r,blend.r),blendLinearLight_4_6(base.g,blend.g),blendLinearLight_4_6(base.b,blend.b));
}

vec3 blendLinearLight_4_6(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight_4_6(base, blend) * opacity + base * (1.0 - opacity));
}


float blendLighten_16_7(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten_16_7(vec3 base, vec3 blend) {
	return vec3(blendLighten_16_7(base.r,blend.r),blendLighten_16_7(base.g,blend.g),blendLighten_16_7(base.b,blend.b));
}

vec3 blendLighten_16_7(vec3 base, vec3 blend, float opacity) {
	return (blendLighten_16_7(base, blend) * opacity + base * (1.0 - opacity));
}


float blendDarken_17_8(float base, float blend) {
	return min(blend,base);
}

vec3 blendDarken_17_8(vec3 base, vec3 blend) {
	return vec3(blendDarken_17_8(base.r,blend.r),blendDarken_17_8(base.g,blend.g),blendDarken_17_8(base.b,blend.b));
}

vec3 blendDarken_17_8(vec3 base, vec3 blend, float opacity) {
	return (blendDarken_17_8(base, blend) * opacity + base * (1.0 - opacity));
}



float blendPinLight_5_9(float base, float blend) {
	return (blend<0.5)?blendDarken_17_8(base,(2.0*blend)):blendLighten_16_7(base,(2.0*(blend-0.5)));
}

vec3 blendPinLight_5_9(vec3 base, vec3 blend) {
	return vec3(blendPinLight_5_9(base.r,blend.r),blendPinLight_5_9(base.g,blend.g),blendPinLight_5_9(base.b,blend.b));
}

vec3 blendPinLight_5_9(vec3 base, vec3 blend, float opacity) {
	return (blendPinLight_5_9(base, blend) * opacity + base * (1.0 - opacity));
}


float blendReflect_18_10(float base, float blend) {
	return (blend==1.0)?blend:min(base*base/(1.0-blend),1.0);
}

vec3 blendReflect_18_10(vec3 base, vec3 blend) {
	return vec3(blendReflect_18_10(base.r,blend.r),blendReflect_18_10(base.g,blend.g),blendReflect_18_10(base.b,blend.b));
}

vec3 blendReflect_18_10(vec3 base, vec3 blend, float opacity) {
	return (blendReflect_18_10(base, blend) * opacity + base * (1.0 - opacity));
}



vec3 blendGlow_6_11(vec3 base, vec3 blend) {
	return blendReflect_18_10(blend,base);
}

vec3 blendGlow_6_11(vec3 base, vec3 blend, float opacity) {
	return (blendGlow_6_11(base, blend) * opacity + base * (1.0 - opacity));
}


float blendOverlay_9_12(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay_9_12(vec3 base, vec3 blend) {
	return vec3(blendOverlay_9_12(base.r,blend.r),blendOverlay_9_12(base.g,blend.g),blendOverlay_9_12(base.b,blend.b));
}

vec3 blendOverlay_9_12(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay_9_12(base, blend) * opacity + base * (1.0 - opacity));
}



vec3 blendHardLight_7_13(vec3 base, vec3 blend) {
	return blendOverlay_9_12(blend,base);
}

vec3 blendHardLight_7_13(vec3 base, vec3 blend, float opacity) {
	return (blendHardLight_7_13(base, blend) * opacity + base * (1.0 - opacity));
}


vec3 blendPhoenix_8_14(vec3 base, vec3 blend) {
	return min(base,blend)-max(base,blend)+vec3(1.0);
}

vec3 blendPhoenix_8_14(vec3 base, vec3 blend, float opacity) {
	return (blendPhoenix_8_14(base, blend) * opacity + base * (1.0 - opacity));
}



vec3 blendNormal_10_15(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal_10_15(vec3 base, vec3 blend, float opacity) {
	return (blendNormal_10_15(base, blend) * opacity + base * (1.0 - opacity));
}


vec3 blendNegation_11_16(vec3 base, vec3 blend) {
	return vec3(1.0)-abs(vec3(1.0)-base-blend);
}

vec3 blendNegation_11_16(vec3 base, vec3 blend, float opacity) {
	return (blendNegation_11_16(base, blend) * opacity + base * (1.0 - opacity));
}


vec3 blendMultiply_19_17(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply_19_17(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply_19_17(base, blend) * opacity + base * (1.0 - opacity));
}



vec3 blendAverage_20_18(vec3 base, vec3 blend) {
	return (base+blend)/2.0;
}

vec3 blendAverage_20_18(vec3 base, vec3 blend, float opacity) {
	return (blendAverage_20_18(base, blend) * opacity + base * (1.0 - opacity));
}




float blendScreen_21_19(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen_21_19(vec3 base, vec3 blend) {
	return vec3(blendScreen_21_19(base.r,blend.r),blendScreen_21_19(base.g,blend.g),blendScreen_21_19(base.b,blend.b));
}

vec3 blendScreen_21_19(vec3 base, vec3 blend, float opacity) {
	return (blendScreen_21_19(base, blend) * opacity + base * (1.0 - opacity));
}


float blendSoftLight_22_20(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight_22_20(vec3 base, vec3 blend) {
	return vec3(blendSoftLight_22_20(base.r,blend.r),blendSoftLight_22_20(base.g,blend.g),blendSoftLight_22_20(base.b,blend.b));
}

vec3 blendSoftLight_22_20(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight_22_20(base, blend) * opacity + base * (1.0 - opacity));
}


float blendSubtract_23_21(float base, float blend) {
	return max(base+blend-1.0,0.0);
}

vec3 blendSubtract_23_21(vec3 base, vec3 blend) {
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendSubtract_23_21(vec3 base, vec3 blend, float opacity) {
	return (blendSubtract_23_21(base, blend) * opacity + base * (1.0 - opacity));
}


vec3 blendExclusion_24_22(vec3 base, vec3 blend) {
	return base+blend-2.0*base*blend;
}

vec3 blendExclusion_24_22(vec3 base, vec3 blend, float opacity) {
	return (blendExclusion_24_22(base, blend) * opacity + base * (1.0 - opacity));
}


vec3 blendDifference_25_23(vec3 base, vec3 blend) {
	return abs(base-blend);
}

vec3 blendDifference_25_23(vec3 base, vec3 blend, float opacity) {
	return (blendDifference_25_23(base, blend) * opacity + base * (1.0 - opacity));
}





float blendAdd_26_24(float base, float blend) {
	return min(base+blend,1.0);
}

vec3 blendAdd_26_24(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd_26_24(vec3 base, vec3 blend, float opacity) {
	return (blendAdd_26_24(base, blend) * opacity + base * (1.0 - opacity));
}





vec3 blendMode_1_25( int mode, vec3 base, vec3 blend ){
	if( mode == 1 ){
		return blendAdd_26_24( base, blend );
	}else
	if( mode == 2 ){
		return blendAverage_20_18( base, blend );
	}else
	if( mode == 3 ){
		return blendColorBurn_15_1( base, blend );
	}else
	if( mode == 4 ){
		return blendColorDodge_14_0( base, blend );
	}else
	if( mode == 5 ){
		return blendDarken_17_8( base, blend );
	}else
	if( mode == 6 ){
		return blendDifference_25_23( base, blend );
	}else
	if( mode == 7 ){
		return blendExclusion_24_22( base, blend );
	}else
	if( mode == 8 ){
		return blendGlow_6_11( base, blend );
	}else
	if( mode == 9 ){
		return blendHardLight_7_13( base, blend );
	}else
	if( mode == 10 ){
		return blendHardMix_2_3( base, blend );
	}else
	if( mode == 11 ){
		return blendLighten_16_7( base, blend );
	}else
	if( mode == 12 ){
		return blendLinearBurn_13_5( base, blend );
	}else
	if( mode == 13 ){
		return blendLinearDodge_12_4( base, blend );
	}else
	if( mode == 14 ){
		return blendLinearLight_4_6( base, blend );
	}else
	if( mode == 15 ){
		return blendMultiply_19_17( base, blend );
	}else
	if( mode == 16 ){
		return blendNegation_11_16( base, blend );
	}else
	if( mode == 17 ){
		return blendNormal_10_15( base, blend );
	}else
	if( mode == 18 ){
		return blendOverlay_9_12( base, blend );
	}else
	if( mode == 19 ){
		return blendPhoenix_8_14( base, blend );
	}else
	if( mode == 20 ){
		return blendPinLight_5_9( base, blend );
	}else
	if( mode == 21 ){
		return blendReflect_18_10( base, blend );
	}else
	if( mode == 22 ){
		return blendScreen_21_19( base, blend );
	}else
	if( mode == 23 ){
		return blendSoftLight_22_20( base, blend );
	}else
	if( mode == 24 ){
		return blendSubtract_23_21( base, blend );
	}else
	if( mode == 25 ){
		return blendVividLight_3_2( base, blend );
	}
}

vec3 blendMode_1_25( int mode, vec3 base, vec3 blend, float opacity ){
	if( mode == 1 ){
		return blendAdd_26_24( base, blend, opacity );
	}else
	if( mode == 2 ){
		return blendAverage_20_18( base, blend, opacity );
	}else
	if( mode == 3 ){
		return blendColorBurn_15_1( base, blend, opacity );
	}else
	if( mode == 4 ){
		return blendColorDodge_14_0( base, blend, opacity );
	}else
	if( mode == 5 ){
		return blendDarken_17_8( base, blend, opacity );
	}else
	if( mode == 6 ){
		return blendDifference_25_23( base, blend, opacity );
	}else
	if( mode == 7 ){
		return blendExclusion_24_22( base, blend, opacity );
	}else
	if( mode == 8 ){
		return blendGlow_6_11( base, blend, opacity );
	}else
	if( mode == 9 ){
		return blendHardLight_7_13( base, blend, opacity );
	}else
	if( mode == 10 ){
		return blendHardMix_2_3( base, blend, opacity );
	}else
	if( mode == 11 ){
		return blendLighten_16_7( base, blend, opacity );
	}else
	if( mode == 12 ){
		return blendLinearBurn_13_5( base, blend, opacity );
	}else
	if( mode == 13 ){
		return blendLinearDodge_12_4( base, blend, opacity );
	}else
	if( mode == 14 ){
		return blendLinearLight_4_6( base, blend, opacity );
	}else
	if( mode == 15 ){
		return blendMultiply_19_17( base, blend, opacity );
	}else
	if( mode == 16 ){
		return blendNegation_11_16( base, blend, opacity );
	}else
	if( mode == 17 ){
		return blendNormal_10_15( base, blend, opacity );
	}else
	if( mode == 18 ){
		return blendOverlay_9_12( base, blend, opacity );
	}else
	if( mode == 19 ){
		return blendPhoenix_8_14( base, blend, opacity );
	}else
	if( mode == 20 ){
		return blendPinLight_5_9( base, blend, opacity );
	}else
	if( mode == 21 ){
		return blendReflect_18_10( base, blend, opacity );
	}else
	if( mode == 22 ){
		return blendScreen_21_19( base, blend, opacity );
	}else
	if( mode == 23 ){
		return blendSoftLight_22_20( base, blend, opacity );
	}else
	if( mode == 24 ){
		return blendSubtract_23_21( base, blend, opacity );
	}else
	if( mode == 25 ){
		return blendVividLight_3_2( base, blend, opacity );
	}
}