export interface ElementProps{
    onBlur?: React.FocusEventHandler<any>;
    onChange?: (event: React.ChangeEvent<any>) => void;
    onFocus?: React.FocusEventHandler<any>;
    autoFocus?: boolean;
}