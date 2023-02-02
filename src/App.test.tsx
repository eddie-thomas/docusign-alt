import { render } from "@testing-library/react";

test("renders div", () => {
  render(<div />);
  expect(true).toBeTruthy();
});
