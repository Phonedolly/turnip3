import { Canvas } from "@react-three/fiber";
import Import from "./Import";

const Three = (props) => {
  return (
    <Import width={props.width}>
      <Canvas>{props.children}</Canvas>
    </Import>
  );
};

export default Three;
