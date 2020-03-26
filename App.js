import React, { useEffect } from 'react';
import { Asset } from 'expo-asset';
import { AR } from 'expo'; 
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { THREE } from 'expo-three';
import * as ThreeAR from 'expo-three-ar';
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from 'expo-graphics';
import { Image } from 'react-native';
import { Mesh } from 'three';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

export default function app() {
  let renderer;
  let scene;
  let camera;
  let geometry;
  let material;
  let cube;
  let points;
  let pikachu;

  useEffect(() => {
    THREE.suppressExpoWarnings(true)
    ThreeAR.suppressWarnings();
 }, []);

 async function onContextCreate({ gl, scale: pixelRatio, width, height }) {
   AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);
 }

  renderer = new ExpoTHREE.Renderer({ 
    gl,
    pixelRatio,
    width,
    height,
  })

  scene = new THREE.Scene();
  scene.background = new ThreeAR.BackgroundTexture(renderer);
  camera = new ThreeAR.Camera(width, height, 0.01, 1000);

  // Cube
  geometry = new THREE.PlaneGeometry(0.3, 0.3); // Largura, Altura

  // material = new THREE.MeshPhongMaterial({ // material: pelo que o cubo é composto
    // color: '#7159c1',
  // });

  // cube = new THREE.Mesh(geometry, material);
  // cube.position.z = -0.4;
  // scene.add(cube);

  // bulbasaus
  //const model = {
    //"bulbasaur.obj": require('./assets/bulbasaur/bulbasaur.obj'),
    //"bulbasaur.png": require('./assets/bulbasaur/images/bulbasaur.png'),
    //"bulbasaur_eye.png": require('./assets/bulbasaur/images/pm0001_00_Eye1_Merged'),
    //"bulbasaur.mtl": require('./assets/bulbasaur/images_shiny/bulbasaurSkin.mtl'),
  //};

  //const bulbasaur = await ExpoTHREE.loadAsync(
   // [model['bulbasaur.obj'], model['bulbasaur_eye.png'], model["bulbasaur.png"], model['bulbasaur.mtl']],
    //null,
    //name => model[name],
  //);

  //ExpoTHREE.utils.scaleLongestSideToSize(bulbasaur, 0.3);
  //ExpoTHREE.utils.alignMesh(bulbasaur, { y: 1 });

  //scene.add(bulbasaur);
  const material = await ExpoTHREE.loadAsync({
    asset: require('./assets/bulbasaur/images_shiny/bulbasaurSkin.mtl'),
    onAssetRequestd: (asset) => console.log(asset),
  });

  const bulbasaur2 = await ExpoTHREE.loadAsync({
    asset: require('./assets/bulbasaur/bulbasaur.obj'),
    material,
  });

  const texture = await ExpoTHREE.loadTextureAsync({ asset: require('./assets/bulbasaur/images/Bulbasaur.png') })

  ExpoTHREE.utils.scaleLongestSideToSize(bulbasaur2, 0.3);
  ExpoTHREE.utils.alignMesh(bulbasaur2, { y: 1 });

  scene.add(bulbasaur2);
  

  
  
   // pikachu = new THREE.Mesh(geometry, Image);
   // pikachu.position.z = -0.4;
   // scene.add(pikachu);

    scene.add(new THREE.AmbientLight('#ffffff')); // scene.add significa que ele está adicionando um objeto na cena

    points = new ThreeAR.points();
    scene.add(points);




  // When the phone rotates, or the view changes size, this method will be called.
  function onResize({ x, y, scale, width, height }) {
    // Let's stop the function if we haven't setup our scene yet
    if (!renderer) {
      return;
    }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(scale);
      renderer.setSize(width, height);
  };

  function onRender() {
    points.update();
    renderer.render(scene, camera);
  }

  // You need to add the `isArEnabled` & `arTrackingConfiguration` props.
    // `isArRunningStateEnabled` Will show us the play/pause button in the corner.
    // `isArCameraStateEnabled` Will render the camera tracking information on the screen.
    // `arTrackingConfiguration` denotes which camera the AR Session will use. 
    // World for rear, Face for front (iPhone X only)
  return (
    <GraphicsView
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
      onRender={onRender}
      onResize={onResize}
      isArEnabled
      isArRunningStateEnabled
      isArCameraStateEnabled
      arTrackingConfiguration={'ARWorldTrackingConfiguration'}
    />
  )
}
