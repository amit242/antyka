import React, { PropTypes } from 'react';
import classNames from 'classnames';
import withStyles from '../../decorators/withStyles';
import styles from './TextBox.less';

@withStyles(styles)
class TextBox {

  static propTypes = {
    maxLines: PropTypes.number,
    textboxLabel: PropTypes.string
  };

  static defaultProps = {
    maxLines: 1
  };

  render() {
    return (
      <div className={classNames(this.props.className, 'TextBox')}>
        <span className="TextBox-span">{this.props.textboxLabel}</span>
        {this.props.maxLines > 1 ?
          <textarea {...this.props} className={classNames(this.props.controlClassName, "TextBox-input")} ref="input" key="input" rows={this.props.maxLines} /> :
          <input {...this.props} className={classNames(this.props.controlClassName, "TextBox-input")} ref="input" key="input" />}
      </div>
    );
  }

}

export default TextBox;
