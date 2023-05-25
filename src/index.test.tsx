//import { getByText, queryByText, render, screen } from "@testing-library/react";
//import App from "./App";
//import React from "react";

import { centerCoords, relativeCoords } from "./dnd";

it("initializes React", () => {
  //const app = render(
  //  <App />
  //);
  //const result = screen.getByText('Hello World!');
  //expect(result).not.toBeFalsy();
});

it("tests drag and drop utility functions", () => {
  const elm = {
    getBoundingClientRect: () => ({
      x: 20,
      y: 30,
      width: 50,
      height: 70,
    }),
  } as HTMLElement;
  const [x, y] = centerCoords(elm);

  expect(x).toBe(45);
  expect(y).toBe(65);

  const evt = ({
    clientX: 40, 
    clientY: 60, 
    currentTarget: elm
  } as unknown) as MouseEvent;

  const [dx, dy] = relativeCoords(evt);

  expect(dx).toBe(-20);
  expect(dy).toBe(-30);
});
