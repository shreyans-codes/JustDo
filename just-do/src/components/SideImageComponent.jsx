import React from "react";

const SideImageComponent = () => {
  return (
    <img
      src="https://source.unsplash.com/random?wallpapers"
      alt="Wallpaper"
      className="h-[100vh] w-full"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "dodgerblue",
        overflow: "hidden",
      }}
    />
  );
};

export default SideImageComponent;
