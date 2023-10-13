import { useState, useEffect } from "react";

type Props = {
  time: number
}

export const Timer: React.FC<Props> = (t) => {
  const [count, setCount] = useState(0);

    useEffect(() => {
        let timer = setInterval(() => {
          setCount((count) => count + 1);
        }, 1000);

        return () => {clearTimeout(timer)}
    }, []);
  
  return (<h1>I've rendered {count} times!</h1>);
}