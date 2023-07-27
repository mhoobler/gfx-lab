import { RefObject } from "react";
import { Node } from "data";

const getCenterCoords = (target: HTMLElement, viewBox: number[]) => {
  const { x, y, width, height } = target.getBoundingClientRect();
  return convertCoords(x + width / 2, y + height / 2, viewBox);
};

const getRelativeCoords = (target: HTMLElement, viewBox: number[]) => {
  const { x, y } = target.getBoundingClientRect();
  return convertCoords(x, y, viewBox);
};

const convertCoords = (x: number, y: number, viewBox: number[]) => {
  return [
    Math.round(((x / window.innerWidth) * viewBox[2] + viewBox[0]) * 1000) /
      1000,
    Math.round(((y / window.innerHeight) * viewBox[3] + viewBox[1]) * 1000) /
      1000,
  ];
};

const useDrag = (
  gRef: RefObject<HTMLElement>,
  senderRef: RefObject<HTMLElement>,
  instance: Node.Instance,
) => {
  const { uuid } = instance;
  const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.button !== 0) {
      return;
    }
    const g = gRef.current;
    const svg = g.parentElement;
    const viewBox = svg.getAttribute("viewBox").split(" ").map(parseFloat);

    svg.removeChild(g);
    svg.appendChild(g);

    const [targetX, targetY] = getRelativeCoords(g, viewBox);
    const [downX, downY] = convertCoords(evt.clientX, evt.clientY, viewBox);
    const dx = targetX - downX;
    const dy = targetY - downY;
    const senderLines = document.querySelectorAll(
      `line[data-sender-id="${uuid}"]`
    );
    const receiverLines = document.querySelectorAll(
      `line[data-receiver-id="${uuid}"]`
    );
    const handleMouseMove = (evt2: MouseEvent) => {
      window.requestAnimationFrame(() => {
        let [moveX, moveY] = convertCoords(evt2.clientX, evt2.clientY, viewBox);
        moveX += dx;
        moveY += dy;
        g.setAttribute("transform", `translate(${moveX}, ${moveY})`);
        for (const line of senderLines) {
          const sender = senderRef.current as unknown as HTMLElement;
          const [senderX, senderY] = getCenterCoords(sender, viewBox);
          line.setAttribute("x1", senderX.toString());
          line.setAttribute("y1", senderY.toString());
        }
        for (const line of receiverLines as NodeListOf<HTMLElement>) {
          const property = line.dataset["property"];
          const index = line.dataset["index"];
          const receiver = document.querySelector(
            `.receiver[data-uuid="${uuid}"][data-property="${property}"][data-index="${index}"]`
          ) as HTMLElement;
          const [cx, cy] = getCenterCoords(receiver, viewBox);
          line.setAttribute("x2", cx.toString());
          line.setAttribute("y2", cy.toString());
        }
      });
    };
    const handleMouseUp = (evt2: MouseEvent) => {
      let [x, y] = convertCoords(evt2.clientX, evt2.clientY, viewBox);
      x += dx;
      y += dy;
      //dispatch({ type: "MOVE_NODE", payload: { x, y, data } });
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  };

  return handleMouseDown;
};

export { useDrag };
