import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import MainStack from "./MainStack";

const RootNavigator = () => {
  const routeNameRef = useRef<string | null>(null);
  const navigationRef = useRef<any>(null);

  const handleStateChange = () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute?.()?.name;

    if (previousRouteName !== currentRouteName) {
      console.log(
        `Navigation from ${previousRouteName} to ${currentRouteName}`
      );
    }

    routeNameRef.current = currentRouteName;
  };

  return (
    <NavigationContainer ref={navigationRef} onStateChange={handleStateChange}>
      <MainStack />
    </NavigationContainer>
  );
};

export default RootNavigator;
