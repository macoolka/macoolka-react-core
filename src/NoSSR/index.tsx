import * as React from 'react';
import {canUseDOM} from '../utils'
export interface INoSSRProps {
    onSSR?: React.ReactElement<any>;
}
const DefaultOnSSR: React.SFC<any> = () => (<span/>);


interface State {
    canRender: boolean;
}

export const NoSSR: React.ComponentClass<INoSSRProps> =
  class extends React.Component<INoSSRProps> {
    // to make defaultProps strictly typed we need to explicitly declare their type
    // @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11640
    static defaultProps: INoSSRProps = {
        onSSR: <DefaultOnSSR/>,
    };

    state: State = {
        canRender: false,
    };

    componentDidMount() {
        if (canUseDOM) {
            this.setState({canRender: true});
        }
    }

    render() {
      const { children, onSSR } = this.props;
      const { canRender } = this.state;
      return canRender ? children : onSSR;
    }
};
