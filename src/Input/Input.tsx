import * as React from 'react';
import BaseHideInput from './BaseHideInput';
// import BaseHideInputRoot from './BaseHideInputRoot';

export type Props = {
  /**
 * The id of the `input` element.
 */
  id?: string;
  /**
 * Attributes applied to the `input` element.
 */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
 * Use that property to pass a ref callback to the native input component.
 */
  inputRef?: (
    ref: HTMLInputElement
  ) => void;
  /**
  * Name attribute of the `select` or hidden `input` element.
  */
  name?: string;
  readOnly?: boolean;
  type?: string,
  /**
* If `true`, the select will be disabled.
*/
  disabled?: boolean;


} & React.InputHTMLAttributes<any>;
class Input extends React.Component<Props> {
  static defaultProps: {
    type: 'input'
  }

  handleFocus = (event: React.FocusEvent) => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }

    const { muiFormControl } = this.context;
    if (muiFormControl && muiFormControl.onFocus) {
      muiFormControl.onFocus(event);
    }
  };

  handleBlur = (event: React.FocusEvent) => {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    const { muiFormControl } = this.context;
    if (muiFormControl && muiFormControl.onBlur) {
      muiFormControl.onBlur(event);
    }
  };

  render() {
    const {
      disabled: disabledProp,
      id,
      inputProps,
      inputRef,
      name,
      value,
      className,
      children,
      type,
      onChange,
      tabIndex,
      ...other
    } = this.props;

    const { muiFormControl } = this.context;
    let disabled = disabledProp;

    if (muiFormControl) {
      if (typeof disabled === 'undefined') {
        disabled = muiFormControl.disabled;
      }
    }
    return (
      <div
        className={className}
        role={undefined}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...other}
      >
        {children}
        <BaseHideInput
          type={type}
          ref={(a:any) => (inputRef && a) ? inputRef(a) : null}
          onChange={onChange}
          name={name}
          value={value}
          disabled={disabled}
          tabIndex={tabIndex}
          {...inputProps}
        />
      </div>
    );
  }
}
export default Input;
