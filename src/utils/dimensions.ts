import React from 'react';
import {Dimensions, PixelRatio, Platform} from 'react-native';
// @ts-ignore
import ExtraDimensions from 'react-native-extra-dimensions-android';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
const pixelDensity = PixelRatio.get();
const adjustedWidth = screenWidth * pixelDensity;
const adjustedHeight = screenHeight * pixelDensity;

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                  along with the percentage symbol (%).
 * @return {number} The calculated dp depending on current device's screen width.
 */

const widthPercentageToDP = (widthPercent: string | number): number => {
  const dim = Dimensions.get('window');

  if (dim.height >= dim.width) {
    this.screenWidth = Dimensions.get('window').width;
  } else {
    this.screenWidth = Dimensions.get('window').height;
  }
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((this.screenWidth * elemWidth) / 100);
};

const heightPercentageToDP = (heightPercent: string | number): number => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    if (Platform.OS == 'android') {
      // if(ExtraDimensions.getStatusBarHeight() > 26)
      // this.screenHeight = Dimensions.get('window').height
      // else
      this.screenHeight =
        Dimensions.get('screen').height -
        ExtraDimensions.getStatusBarHeight() -
        ExtraDimensions.getSoftMenuBarHeight();
    } else {
      this.screenHeight = Dimensions.get('screen').height;
    }
  } else {
    this.screenHeight = Dimensions.get('window').width;
  }
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((this.screenHeight * elemHeight) / 100);
};

export {widthPercentageToDP, heightPercentageToDP, screenWidth, screenHeight};
