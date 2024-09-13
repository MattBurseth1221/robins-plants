const loadingFlower = (
  <svg
    version="1.1"
    viewBox="-58 -58 116 116"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="32"
    height="32"
    className="mx-auto"
  >
    <g stroke-linecap="round" stroke-width="15">
      <path id="a" d="m0 35 0,14" />
      <use transform="rotate(210)" xlinkHref="#a" stroke="#f0f0f0" />
      <use transform="rotate(240)" xlinkHref="#a" stroke="#ebebeb" />
      <use transform="rotate(270)" xlinkHref="#a" stroke="#d3d3d3" />
      <use transform="rotate(300)" xlinkHref="#a" stroke="#bcbcbc" />
      <use transform="rotate(330)" xlinkHref="#a" stroke="#a4a4a4" />
      <use transform="rotate(0)" xlinkHref="#a" stroke="#8d8d8d" />
      <use transform="rotate(30)" xlinkHref="#a" stroke="#757575" />
      <use transform="rotate(60)" xlinkHref="#a" stroke="#5e5e5e" />
      <use transform="rotate(90)" xlinkHref="#a" stroke="#464646" />
      <use transform="rotate(120)" xlinkHref="#a" stroke="#2f2f2f" />
      <use transform="rotate(150)" xlinkHref="#a" stroke="#171717" />
      <use transform="rotate(180)" xlinkHref="#a" stroke="#000" />
    </g>
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 0 0"
      to="360 0 0"
      dur="1s"
      repeatCount="indefinite"
    />
  </svg>
);

export { loadingFlower };