import { PerspectiveCamera } from '@react-three/drei';
import { useCameraMove } from '../../lib/useCameraMove';
import { useCameraPath } from '../../lib/useCameraPath';

function ActionCamera() {
  const cameraSettings = {
    fov: 55,
    near: 0.1,
    zoom: 0.75,
    far: 100,
    position: [0, 1, 9],
  };
  // Animate camera by path
  const cameraEmptyMesh = useCameraPath();
  // Animate camera on mouse move
  const cameraRef = useCameraMove(cameraEmptyMesh);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      {...cameraSettings}
      makeDefault
    />
  );
}

export default ActionCamera;
