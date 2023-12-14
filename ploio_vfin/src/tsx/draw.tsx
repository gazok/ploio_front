import { useState } from "react"

type DrawPropsCircle = {
    centerX: number
    centerY: number
    radius: number
}

export const DrawCircle: React.FC<DrawPropsCircle> = (DProps) => {
    const [showCircles, setShowCircles] = useState(true);
    const centerX = DProps.centerX;
    const centerY = DProps.centerY;
    const radius = DProps.radius;

    return (
      <>
        <circle className="fill-lightblue" cx={centerX} cy={centerY} r={radius} />
      </>
    );
  }