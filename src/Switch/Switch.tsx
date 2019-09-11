// @inheritedComponent IconButton

import * as React from 'react';
import BaseSwitch from './BaseSwitch';
import { not,isNull } from 'macoolka-predicate';
const notIsNull = not(isNull);
export type Props = React.InputHTMLAttributes<any> & {
  /**
 * If `true`, the component is checked.
 */
  checked?: boolean;
  /**
 * The icon to display when the component is checked.
 */
  checkedIcon: React.ReactNode;
  defaultChecked?: boolean;
  /**
 * If `true`, the ripple effect will be disabled.
 */
  disableRipple?: boolean;
  /**
 * The icon to display when the component is unchecked.
 */
  unCheckedIcon: React.ReactNode;
  /**
 * If `true`, the component appears indeterminate.
 */
  indeterminate?: boolean;
  /**
 * The icon to display when the component is indeterminate.
 */
  indeterminateIcon?: React.ReactNode;
  /**
 * Callback fired when the state is changed.
 *
 * @param {object} event The event source of the callback.
 * You can pull out the new value by accessing `event.target.checked`.
 * @param {boolean} checked The `checked` value of the switch
 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;

  className?: string;

}
type State = {
  checked?: boolean
}
class SwitchBase extends React.Component<Props, State> {
  static defaultProps: {
    type: 'checkbox'
  }
  input = null;

  // isControlled:boolean = true;

  constructor(props: Props) {
    super(props);


    this.state.checked = notIsNull(props.checked) ? props.checked : notIsNull(props.defaultChecked) ? props.defaultChecked : false;

  }

  state: State = {};

  handleInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const checked = event.target.checked;

    //if (!this.isControlled) {
    this.setState({ checked });
    // }

    if (this.props.onChange) {
      this.props.onChange(event, checked);
    }
  };

  render() {
    const {
      checked: checkedProp,
      checkedIcon,
      disabled: disabledProp,
      unCheckedIcon,
      id,
      type,
      ...other
    } = this.props;

    const { muiFormControl } = this.context;
    let disabled = disabledProp;

    if (muiFormControl) {
      if (typeof disabled === 'undefined') {
        disabled = muiFormControl.disabled;
      }
    }

    const checked = this.state.checked;
    const hasLabelFor = type === 'checkbox' || type === 'radio';
    return (
      <BaseSwitch
        disabled={disabled}
        tabIndex={undefined}
        role={undefined}
        onChange={this.handleInputChange}
        inputProps={{
          id: hasLabelFor ? id : '',
          type: 'checkbox',
          checked,
        }}
        {...other}
      >
         {checked ? checkedIcon : unCheckedIcon}
      </BaseSwitch>
    );
  }
}


/* SwitchBase.contextTypes = {
  muiFormControl: PropTypes.object,
};
 */
export default SwitchBase;
