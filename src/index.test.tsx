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
  let elm = {
    getBoundingClientRect: () => ({
      x: 20,
      y: 30,
      width: 50,
      height: 70,
    }),
  } as HTMLElement;
  let [x, y] = centerCoords(elm);

  expect(x).toBe(45);
  expect(y).toBe(65);

  let evt = ({
    clientX: 40, 
    clientY: 60, 
    currentTarget: elm
  } as unknown) as MouseEvent;

  let [dx, dy] = relativeCoords(evt);

  expect(dx).toBe(-20);
  expect(dy).toBe(-30);
});
