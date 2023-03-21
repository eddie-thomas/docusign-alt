/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import { render } from "@testing-library/react";

test("renders div", () => {
  render(<div />);
  expect(true).toBeTruthy();
});
