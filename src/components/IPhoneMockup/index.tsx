"use client";

import React, { useMemo } from "react";

type ColorValue = React.CSSProperties["color"];
type StyleMap = Record<string, React.CSSProperties>;

export interface IPhoneMockupProps {
  screenWidth: number;
  screenType?: "legacy" | "notch" | "island";
  isLandscape?: boolean;
  className?: string;
  containerStyle?: React.CSSProperties;
  containerStlye?: React.CSSProperties;
  frameColor?: ColorValue;
  frameOnly?: boolean;
  statusbarColor?: ColorValue;
  hideStatusBar?: boolean;
  transparentNavBar?: boolean;
  hideNavBar?: boolean;
  children?: React.ReactNode;
}

interface IosVariantProps {
  screenWidth: number;
  frameColor: ColorValue;
  frameOnly: boolean;
  statusbarColor: ColorValue;
  hideStatusBar: boolean;
  transparentNavigationBar: boolean;
  hideNavigationBar: boolean;
  children?: React.ReactNode;
}

interface StyleParams {
  screenType: "notch" | "island";
  isLandscape: boolean;
  getSizeWithRatio: (size: number) => number;
  screenWidth: number;
  mockupHeight: number;
  frameColor: ColorValue;
  frameWidth: number;
  statusbarColor: ColorValue;
  frameOnly: boolean;
  bezelRadius: number;
}

interface LegacyStyleParams {
  isLandscape: boolean;
  getSizeWithRatio: (size: number) => number;
  screenWidth: number;
  mockupHeight: number;
  frameColor: ColorValue;
  statusbarColor: ColorValue;
  frameOnly: boolean;
}

export function IPhoneMockup({
  screenWidth,
  screenType = "island",
  isLandscape = false,
  frameColor = "#666666",
  frameOnly = false,
  statusbarColor = "#CCCCCC",
  hideStatusBar = false,
  transparentNavBar = false,
  hideNavBar = false,
  className,
  containerStyle,
  containerStlye,
  children,
}: IPhoneMockupProps) {
  const Mockup = useMemo(() => {
    if (screenType === "legacy") {
      return isLandscape ? IPhoneLegacyLandscape : IPhoneLegacyPortrait;
    }

    if (screenType === "notch") {
      return isLandscape ? IPhoneNotchLandscape : IPhoneNotchPortrait;
    }

    return isLandscape ? IPhoneIslandLandscape : IPhoneIslandPortrait;
  }, [isLandscape, screenType]);

  return (
    <div className={className} style={containerStyle ?? containerStlye}>
      <Mockup
        screenWidth={screenWidth}
        frameColor={frameColor}
        frameOnly={frameOnly}
        statusbarColor={statusbarColor}
        hideStatusBar={hideStatusBar}
        transparentNavigationBar={transparentNavBar}
        hideNavigationBar={hideNavBar}
      >
        {children}
      </Mockup>
    </div>
  );
}

function createStyles(styles: StyleMap): StyleMap {
  return styles;
}

function getStyles({
  screenType,
  isLandscape,
  getSizeWithRatio,
  screenWidth,
  mockupHeight,
  frameColor,
  frameWidth,
  statusbarColor,
  frameOnly,
  bezelRadius,
}: StyleParams) {
  const frameWidthValue = frameWidth;
  const halfFrameWidth = Math.floor(frameWidthValue / 2);
  const widthAndFrame = screenWidth + frameWidthValue * 2;
  const heightAndFrame = mockupHeight + frameWidthValue * 2;
  const frameButtonSize = Math.floor(frameWidthValue * 0.9);
  const frameButtonPosition =
    (isLandscape ? mockupHeight : screenWidth) +
    frameWidthValue +
    halfFrameWidth +
    frameButtonSize -
    halfFrameWidth;

  const paddingRight = frameOnly
    ? 0
    : isLandscape
      ? 0
      : frameButtonSize - halfFrameWidth;
  const paddingLeft = paddingRight;
  const paddingTop = frameOnly
    ? 0
    : isLandscape
      ? frameButtonSize - halfFrameWidth
      : 0;
  const paddingBottom = paddingTop;

  const isIsland = screenType === "island";
  const topInset = isLandscape
    ? 0
    : getSizeWithRatio(isIsland ? 59 : 44);
  const leftInset = isLandscape ? getSizeWithRatio(isIsland ? 59 : 44) : 0;
  const rightInset = leftInset;
  const bottomInset = isLandscape ? getSizeWithRatio(21) : getSizeWithRatio(34);
  const powerPosition = getSizeWithRatio(isIsland ? 280 : 250);

  return createStyles({
    container: {
      display: "flex",
      flexDirection: isLandscape ? "row" : "column",
      boxSizing: "content-box",
      position: "relative",
      width: widthAndFrame,
      height: heightAndFrame,
      paddingRight,
      paddingLeft,
      paddingTop,
      paddingBottom,
    },
    frame: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      boxSizing: "border-box",
      borderRadius: bezelRadius,
      borderStyle: "solid",
      borderWidth: frameWidthValue,
      borderColor: frameColor,
      overflow: "hidden",
    },
    screen: {
      display: "flex",
      flexDirection: isLandscape ? "row" : "column",
      position: "relative",
      width: screenWidth,
      height: mockupHeight,
      backgroundColor: "transparent",
      overflow: "hidden",
    },
    notchContainer: {
      display: "flex",
      flexDirection: "column",
      width: isLandscape ? leftInset : "100%",
      height: isLandscape ? "100%" : topInset,
      backgroundColor: statusbarColor,
      alignItems: isLandscape ? "flex-start" : "center",
      justifyContent: isLandscape ? "center" : "flex-start",
    },
    notchContainerFullScreen: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      width: isLandscape ? leftInset : "100%",
      height: isLandscape ? "100%" : topInset,
      alignItems: isLandscape ? "flex-start" : "center",
      justifyContent: isLandscape ? "center" : "flex-start",
      pointerEvents: "none",
    },
    safeAreaRight: {
      width: rightInset,
      height: "100%",
      backgroundColor: statusbarColor,
    },
    island: {
      width: isLandscape ? getSizeWithRatio(35) : getSizeWithRatio(128),
      height: isLandscape ? getSizeWithRatio(128) : getSizeWithRatio(35),
      backgroundColor: frameColor,
      borderRadius: getSizeWithRatio(50),
      marginTop: isLandscape ? undefined : getSizeWithRatio(13),
      marginLeft: isLandscape ? getSizeWithRatio(13) : undefined,
    },
    notch: {
      width: isLandscape ? getSizeWithRatio(31) : getSizeWithRatio(160),
      height: isLandscape ? getSizeWithRatio(160) : getSizeWithRatio(31),
      backgroundColor: frameColor,
      borderBottomLeftRadius: isLandscape ? 0 : getSizeWithRatio(20),
      borderBottomRightRadius: getSizeWithRatio(20),
      borderTopRightRadius: isLandscape ? getSizeWithRatio(20) : 0,
    },
    swipeContainer: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: bottomInset,
      backgroundColor: statusbarColor,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    swipeContainerFullScreen: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: bottomInset,
      alignItems: "center",
      justifyContent: "flex-end",
      pointerEvents: "none",
    },
    swipeBar: {
      backgroundColor: frameColor,
      borderRadius: getSizeWithRatio(100),
      width: isLandscape ? getSizeWithRatio(230) : "35%",
      height: getSizeWithRatio(7),
      marginBottom: isLandscape ? getSizeWithRatio(5) : getSizeWithRatio(10),
    },
    silenceSwitch: {
      position: "absolute",
      borderRadius: frameWidthValue,
      top: isLandscape ? frameButtonPosition : getSizeWithRatio(165),
      left: isLandscape ? getSizeWithRatio(165) : undefined,
      right: isLandscape ? undefined : frameButtonPosition,
      width: isLandscape ? getSizeWithRatio(34) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(34),
      backgroundColor: frameColor,
    },
    volumeUp: {
      position: "absolute",
      borderRadius: frameWidthValue,
      top: isLandscape ? frameButtonPosition : getSizeWithRatio(230),
      left: isLandscape ? getSizeWithRatio(230) : undefined,
      right: isLandscape ? undefined : frameButtonPosition,
      width: isLandscape ? getSizeWithRatio(65) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(65),
      backgroundColor: frameColor,
    },
    volumeDown: {
      position: "absolute",
      borderRadius: frameWidthValue,
      top: isLandscape ? frameButtonPosition : getSizeWithRatio(315),
      left: isLandscape ? getSizeWithRatio(315) : undefined,
      right: isLandscape ? undefined : frameButtonPosition,
      width: isLandscape ? getSizeWithRatio(65) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(65),
      backgroundColor: frameColor,
    },
    power: {
      position: "absolute",
      borderRadius: frameWidthValue,
      top: isLandscape ? undefined : powerPosition,
      left: isLandscape ? powerPosition : frameButtonPosition,
      bottom: isLandscape ? frameButtonPosition : undefined,
      width: isLandscape ? getSizeWithRatio(105) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(105),
      backgroundColor: frameColor,
    },
    notchPad: {
      alignSelf: "center",
      position: "absolute",
      top: isLandscape ? undefined : halfFrameWidth,
      left: isLandscape ? halfFrameWidth : undefined,
      width: isLandscape ? getSizeWithRatio(20) : getSizeWithRatio(160),
      height: isLandscape ? getSizeWithRatio(160) : getSizeWithRatio(20),
      backgroundColor: frameColor,
    },
  });
}

function IPhoneIslandPortrait(props: IosVariantProps) {
  const {
    screenWidth,
    frameColor,
    frameOnly,
    statusbarColor,
    hideStatusBar,
    hideNavigationBar,
    transparentNavigationBar,
    children,
  } = props;
  const styles = useMemo(() => {
    const getSizeWithRatio = (size: number) =>
      Math.max(Math.floor((screenWidth * size) / 390), 1);

    return getStyles({
      screenType: "island",
      isLandscape: false,
      getSizeWithRatio,
      screenWidth,
      mockupHeight: Math.floor((screenWidth / 9) * 19.5),
      frameColor,
      frameWidth: getSizeWithRatio(10),
      frameOnly,
      statusbarColor,
      bezelRadius: getSizeWithRatio(68),
    });
  }, [screenWidth, frameColor, statusbarColor, frameOnly]);

  return (
    <div style={styles.container}>
      <div style={styles.frame}>
        <div style={styles.screen}>
          {!hideStatusBar && (
            <div style={styles.notchContainer}>
              <div style={styles.island} />
            </div>
          )}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {children}
          </div>
          {!hideNavigationBar && !transparentNavigationBar && (
            <div style={styles.swipeContainer}>
              <div style={styles.swipeBar} />
            </div>
          )}
        </div>
        {hideStatusBar && (
          <div style={styles.notchContainerFullScreen}>
            <div style={styles.island} />
          </div>
        )}
        {!hideNavigationBar && transparentNavigationBar && (
          <div style={styles.swipeContainerFullScreen}>
            <div style={styles.swipeBar} />
          </div>
        )}
      </div>
      {!frameOnly && (
        <>
          <div style={styles.silenceSwitch} />
          <div style={styles.volumeUp} />
          <div style={styles.volumeDown} />
          <div style={styles.power} />
        </>
      )}
    </div>
  );
}

function IPhoneIslandLandscape(props: IosVariantProps) {
  const {
    screenWidth,
    frameColor,
    frameOnly,
    statusbarColor,
    hideStatusBar,
    hideNavigationBar,
    transparentNavigationBar,
    children,
  } = props;
  const styles = useMemo(() => {
    const getSizeWithRatio = (size: number) =>
      Math.max(Math.floor((screenWidth * size) / 844), 1);

    return getStyles({
      screenType: "island",
      isLandscape: true,
      getSizeWithRatio,
      screenWidth,
      mockupHeight: Math.floor((screenWidth / 19.5) * 9),
      frameColor,
      frameWidth: getSizeWithRatio(10),
      frameOnly,
      statusbarColor,
      bezelRadius: getSizeWithRatio(68),
    });
  }, [screenWidth, frameColor, statusbarColor, frameOnly]);

  return (
    <div style={styles.container}>
      <div style={styles.frame}>
        <div style={styles.screen}>
          {!hideStatusBar && (
            <div style={styles.notchContainer}>
              <div style={styles.island} />
            </div>
          )}
          <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {children}
            </div>
            {!hideNavigationBar && !transparentNavigationBar && (
              <div style={styles.swipeContainer}>
                <div style={styles.swipeBar} />
              </div>
            )}
          </div>
          {!hideStatusBar && <div style={styles.safeAreaRight} />}
        </div>
        {hideStatusBar && (
          <div style={styles.notchContainerFullScreen}>
            <div style={styles.island} />
          </div>
        )}
        {!hideNavigationBar && transparentNavigationBar && (
          <div style={styles.swipeContainerFullScreen}>
            <div style={styles.swipeBar} />
          </div>
        )}
      </div>
      {!frameOnly && (
        <>
          <div style={styles.silenceSwitch} />
          <div style={styles.volumeUp} />
          <div style={styles.volumeDown} />
          <div style={styles.power} />
        </>
      )}
    </div>
  );
}

function IPhoneNotchPortrait(props: IosVariantProps) {
  const {
    screenWidth,
    frameColor,
    frameOnly,
    statusbarColor,
    hideStatusBar,
    hideNavigationBar,
    transparentNavigationBar,
    children,
  } = props;
  const styles = useMemo(() => {
    const getSizeWithRatio = (size: number) =>
      Math.max(Math.floor((screenWidth * size) / 390), 1);

    return getStyles({
      screenType: "notch",
      isLandscape: false,
      getSizeWithRatio,
      screenWidth,
      mockupHeight: Math.floor((screenWidth / 9) * 19.5),
      frameColor,
      frameWidth: getSizeWithRatio(14),
      frameOnly,
      statusbarColor,
      bezelRadius: getSizeWithRatio(64),
    });
  }, [screenWidth, frameColor, statusbarColor, frameOnly]);

  return (
    <div style={styles.container}>
      <div style={styles.frame}>
        <div style={styles.screen}>
          {!hideStatusBar && (
            <div style={styles.notchContainer}>
              <div style={styles.notch} />
            </div>
          )}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {children}
          </div>
          {!hideNavigationBar && !transparentNavigationBar && (
            <div style={styles.swipeContainer}>
              <div style={styles.swipeBar} />
            </div>
          )}
        </div>
        {hideStatusBar && (
          <div style={styles.notchContainerFullScreen}>
            <div style={styles.notch} />
          </div>
        )}
        {!hideNavigationBar && transparentNavigationBar && (
          <div style={styles.swipeContainerFullScreen}>
            <div style={styles.swipeBar} />
          </div>
        )}
      </div>
      <div style={styles.notchPad} />
      {!frameOnly && (
        <>
          <div style={styles.silenceSwitch} />
          <div style={styles.volumeUp} />
          <div style={styles.volumeDown} />
          <div style={styles.power} />
        </>
      )}
    </div>
  );
}

function IPhoneNotchLandscape(props: IosVariantProps) {
  const {
    screenWidth,
    frameColor,
    frameOnly,
    statusbarColor,
    hideStatusBar,
    hideNavigationBar,
    transparentNavigationBar,
    children,
  } = props;
  const styles = useMemo(() => {
    const getSizeWithRatio = (size: number) =>
      Math.max(Math.floor((screenWidth * size) / 844), 1);

    return getStyles({
      screenType: "notch",
      isLandscape: true,
      getSizeWithRatio,
      screenWidth,
      mockupHeight: Math.floor((screenWidth / 19.5) * 9),
      frameColor,
      frameWidth: getSizeWithRatio(14),
      frameOnly,
      statusbarColor,
      bezelRadius: getSizeWithRatio(64),
    });
  }, [screenWidth, frameColor, statusbarColor, frameOnly]);

  return (
    <div style={styles.container}>
      <div style={styles.frame}>
        <div style={styles.screen}>
          {!hideStatusBar && (
            <div style={styles.notchContainer}>
              <div style={styles.notch} />
            </div>
          )}
          <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {children}
            </div>
            {!hideNavigationBar && !transparentNavigationBar && (
              <div style={styles.swipeContainer}>
                <div style={styles.swipeBar} />
              </div>
            )}
          </div>
          {!hideStatusBar && <div style={styles.safeAreaRight} />}
        </div>
        {hideStatusBar && (
          <div style={styles.notchContainerFullScreen}>
            <div style={styles.notch} />
          </div>
        )}
        {!hideNavigationBar && transparentNavigationBar && (
          <div style={styles.swipeContainerFullScreen}>
            <div style={styles.swipeBar} />
          </div>
        )}
      </div>
      <div style={styles.notchPad} />
      {!frameOnly && (
        <>
          <div style={styles.silenceSwitch} />
          <div style={styles.volumeUp} />
          <div style={styles.volumeDown} />
          <div style={styles.power} />
        </>
      )}
    </div>
  );
}

function getLegacyStyles({
  isLandscape,
  getSizeWithRatio,
  screenWidth,
  mockupHeight,
  frameColor,
  statusbarColor,
  frameOnly,
}: LegacyStyleParams) {
  const frameWidth = getSizeWithRatio(22);
  const halfFrameWidth = Math.floor(frameWidth / 2);
  const widthAndFrame = screenWidth + frameWidth * 2;
  const heightAndFrame = mockupHeight + frameWidth * 2;
  const upperBezelSize = getSizeWithRatio(110);
  const lowerBezelSize = getSizeWithRatio(110);
  const frameButtonSize = Math.floor(frameWidth * 0.8);
  const frameButtonPosition =
    (isLandscape ? mockupHeight : screenWidth) +
    frameWidth +
    halfFrameWidth +
    frameButtonSize -
    halfFrameWidth;
  const paddingRight = frameOnly
    ? 0
    : isLandscape
      ? 0
      : frameButtonSize - halfFrameWidth;
  const paddingLeft = paddingRight;
  const paddingTop = frameOnly
    ? 0
    : isLandscape
      ? frameButtonSize - halfFrameWidth
      : 0;
  const paddingBottom = paddingTop;
  const bezelRadius = getSizeWithRatio(60);

  return createStyles({
    container: {
      display: "flex",
      flexDirection: isLandscape ? "row" : "column",
      boxSizing: "content-box",
      position: "relative",
      width: isLandscape
        ? screenWidth + upperBezelSize + lowerBezelSize
        : widthAndFrame,
      height: isLandscape
        ? heightAndFrame
        : mockupHeight + upperBezelSize + lowerBezelSize,
      paddingRight,
      paddingLeft,
      paddingTop,
      paddingBottom,
    },
    frame: {
      display: "flex",
      flexDirection: "column",
      alignItems: isLandscape ? "flex-start" : "center",
      justifyContent: isLandscape ? "center" : "flex-start",
      position: "relative",
      boxSizing: "border-box",
      borderLeftWidth: frameWidth,
      borderLeftStyle: "solid",
      borderRightWidth: frameWidth,
      borderRightStyle: "solid",
      borderColor: frameColor,
      width: isLandscape ? screenWidth : widthAndFrame,
      height: isLandscape ? heightAndFrame : mockupHeight,
      overflow: "hidden",
    },
    upperBezel: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      borderTopLeftRadius: bezelRadius,
      borderTopRightRadius: isLandscape ? 0 : bezelRadius,
      borderBottomLeftRadius: isLandscape ? bezelRadius : 0,
      width: isLandscape ? upperBezelSize : widthAndFrame,
      height: isLandscape ? heightAndFrame : upperBezelSize,
      backgroundColor: frameColor,
      justifyContent: "center",
    },
    cameraSpeakerContainer: {
      display: "flex",
      flexDirection: isLandscape ? "row" : "column",
      position: "relative",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    camera: {
      position: "absolute",
      left: isLandscape ? undefined : -getSizeWithRatio(38),
      bottom: isLandscape ? -getSizeWithRatio(38) : 0,
      width: getSizeWithRatio(10),
      height: getSizeWithRatio(10),
      borderRadius: getSizeWithRatio(10),
      backgroundColor: statusbarColor,
    },
    speaker: {
      position: "relative",
      width: isLandscape ? getSizeWithRatio(10) : getSizeWithRatio(80),
      height: isLandscape ? getSizeWithRatio(80) : getSizeWithRatio(10),
      backgroundColor: statusbarColor,
      borderRadius: getSizeWithRatio(10),
    },
    lowerBezel: {
      display: "flex",
      flexDirection: isLandscape ? "row" : "column",
      borderTopRightRadius: isLandscape ? bezelRadius : 0,
      borderBottomLeftRadius: isLandscape ? 0 : bezelRadius,
      borderBottomRightRadius: bezelRadius,
      width: isLandscape ? lowerBezelSize : widthAndFrame,
      height: isLandscape ? heightAndFrame : lowerBezelSize,
      backgroundColor: frameColor,
      alignItems: "center",
      justifyContent: "center",
    },
    homeButton: {
      width: getSizeWithRatio(65),
      height: getSizeWithRatio(65),
      backgroundColor: statusbarColor,
      borderRadius: getSizeWithRatio(65),
    },
    screen: {
      display: "flex",
      flexDirection: isLandscape ? "row" : "column",
      position: "relative",
      width: screenWidth,
      height: mockupHeight,
      backgroundColor: "transparent",
    },
    statusbar: {
      width: "100%",
      height: getSizeWithRatio(20),
      backgroundColor: statusbarColor,
      alignItems: "center",
    },
    silenceSwitch: {
      position: "absolute",
      borderRadius: frameWidth,
      top: isLandscape ? frameButtonPosition : getSizeWithRatio(115),
      left: isLandscape ? getSizeWithRatio(115) : undefined,
      right: isLandscape ? undefined : frameButtonPosition,
      width: isLandscape ? getSizeWithRatio(36) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(36),
      backgroundColor: frameColor,
    },
    volumeUp: {
      position: "absolute",
      borderRadius: frameWidth,
      top: isLandscape ? frameButtonPosition : getSizeWithRatio(185),
      left: isLandscape ? getSizeWithRatio(185) : undefined,
      right: frameButtonPosition,
      width: isLandscape ? getSizeWithRatio(70) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(70),
      backgroundColor: frameColor,
    },
    volumeDown: {
      position: "absolute",
      borderRadius: frameWidth,
      top: isLandscape ? frameButtonPosition : getSizeWithRatio(270),
      left: isLandscape ? getSizeWithRatio(270) : undefined,
      right: isLandscape ? undefined : frameButtonPosition,
      width: isLandscape ? getSizeWithRatio(70) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(70),
      backgroundColor: frameColor,
    },
    power: {
      position: "absolute",
      borderRadius: frameWidth,
      top: isLandscape ? undefined : getSizeWithRatio(190),
      left: isLandscape ? getSizeWithRatio(190) : frameButtonPosition,
      bottom: isLandscape ? frameButtonPosition : undefined,
      width: isLandscape ? getSizeWithRatio(64) : frameButtonSize,
      height: isLandscape ? frameButtonSize : getSizeWithRatio(64),
      backgroundColor: frameColor,
    },
  });
}

function IPhoneLegacyPortrait(props: IosVariantProps) {
  const {
    screenWidth,
    frameColor,
    frameOnly,
    statusbarColor,
    hideStatusBar,
    children,
  } = props;
  const styles = useMemo(() => {
    const getSizeWithRatio = (size: number) =>
      Math.max(Math.floor((screenWidth * size) / 375), 1);

    return getLegacyStyles({
      isLandscape: false,
      getSizeWithRatio,
      screenWidth,
      mockupHeight: Math.floor((screenWidth / 9) * 16),
      frameColor,
      statusbarColor,
      frameOnly,
    });
  }, [screenWidth, frameColor, statusbarColor, frameOnly]);

  return (
    <div style={styles.container}>
      <div style={styles.upperBezel}>
        <div style={styles.cameraSpeakerContainer}>
          <div style={styles.speaker}>
            <div style={styles.camera} />
          </div>
        </div>
      </div>
      <div style={styles.frame}>
        <div style={styles.screen}>
          {!hideStatusBar && <div style={styles.statusbar} />}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {children}
          </div>
        </div>
      </div>
      <div style={styles.lowerBezel}>
        <div style={styles.homeButton} />
      </div>
      {!frameOnly && (
        <>
          <div style={styles.silenceSwitch} />
          <div style={styles.volumeUp} />
          <div style={styles.volumeDown} />
          <div style={styles.power} />
        </>
      )}
    </div>
  );
}

function IPhoneLegacyLandscape(props: IosVariantProps) {
  const { screenWidth, frameColor, frameOnly, statusbarColor, children } =
    props;
  const styles = useMemo(() => {
    const getSizeWithRatio = (size: number) =>
      Math.max(Math.floor((screenWidth * size) / 667), 1);

    return getLegacyStyles({
      isLandscape: true,
      getSizeWithRatio,
      screenWidth,
      mockupHeight: Math.floor((screenWidth / 16) * 9),
      frameColor,
      statusbarColor,
      frameOnly,
    });
  }, [screenWidth, frameColor, statusbarColor, frameOnly]);

  return (
    <div style={styles.container}>
      <div style={styles.upperBezel}>
        <div style={styles.cameraSpeakerContainer}>
          <div style={styles.speaker}>
            <div style={styles.camera} />
          </div>
        </div>
      </div>
      <div style={styles.frame}>
        <div style={styles.screen}>
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {children}
          </div>
        </div>
      </div>
      <div style={styles.lowerBezel}>
        <div style={styles.homeButton} />
      </div>
      {!frameOnly && (
        <>
          <div style={styles.silenceSwitch} />
          <div style={styles.volumeUp} />
          <div style={styles.volumeDown} />
          <div style={styles.power} />
        </>
      )}
    </div>
  );
}
