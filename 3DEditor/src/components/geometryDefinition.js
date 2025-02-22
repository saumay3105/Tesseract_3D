export const geometryDefinitions = {
  prism: `const createPrismGeometry = () => {
    return new THREE.CylinderGeometry(1, 1, 1, 6);
  };`,

  capsule: `const createCapsuleGeometry = () => {
    return new THREE.CapsuleGeometry(0.5, 1, 4, 8);
  };`,

  tube: `const createTubeGeometry = () => {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(1, 0, 0),
    ]);
    return new THREE.TubeGeometry(path, 20, 0.2, 8, false);
  };`,

  arch: `const createArchGeometry = () => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 0);
    shape.lineTo(1, 0);
    shape.lineTo(1, 1.5);
    shape.absarc(0, 1.5, 1, 0, Math.PI, false);
    shape.lineTo(-1, 1.5);
    shape.lineTo(-1, 0);
  
    const extrudeSettings = {
      steps: 1,
      depth: 0.3,
      bevelEnabled: false,
    };
  
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };`,

  stairs: `const createStairsGeometry = () => {
    const steps = 5;
    const width = 1;
    const stepHeight = 0.2;
    const stepDepth = 0.3;
  
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const normals = [];
    const uvs = [];
  
    for (let i = 0; i < steps; i++) {
      const y = i * stepHeight;
      const z = -i * stepDepth;
  
      vertices.push(
        -width / 2, y, z,
        width / 2, y, z,
        width / 2, y + stepHeight, z,
        -width / 2, y + stepHeight, z,
        -width / 2, y + stepHeight, z,
        width / 2, y + stepHeight, z,
        width / 2, y + stepHeight, z - stepDepth,
        -width / 2, y + stepHeight, z - stepDepth
      );
  
      const baseIndex = i * 8;
      indices.push(
        baseIndex, baseIndex + 1, baseIndex + 2,
        baseIndex, baseIndex + 2, baseIndex + 3,
        baseIndex + 4, baseIndex + 5, baseIndex + 6,
        baseIndex + 4, baseIndex + 6, baseIndex + 7
      );
  
      normals.push(
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
      );
  
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1);
    }
  
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
  
    return geometry;
  };`,

  wall: `const createWallGeometry = () => {
    return new THREE.BoxGeometry(2, 1, 0.2);
  };`,

  pyramid: `const createPyramidGeometry = () => {
    return new THREE.ConeGeometry(1, 1.5, 4);
  };`,
};
