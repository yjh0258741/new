import classNames from 'classnames';

import './BtnGroup.less';
import { noop } from '../../lib/utillib';

export default function BtnGroup({
  buttons = [],
  containerClass,
  containerStyle = {},
  marginTop,
  noPadding,
  onClick,
  flex = false,
  fixedBottom = false,
}) {
  if (!buttons || !buttons.length) {
    // eslint-disable-next-line react/self-closing-comp
    return <div></div>;
  }

  return (
    <div
      className={classNames('btn-group', containerClass, {
        'no-padding': noPadding,
        flex,
        'fixed-bottom': fixedBottom,
        // ipx: wxlib.system.isFullScreen(),
      })}
      style={{
        marginTop: `${marginTop}px`,
        ...containerStyle,
      }}
    >
      {buttons.map((item, index) => (
        <div
          role="button"
          key={index}
          disabled={item.disabled}
          className={classNames('btn need-hover',
            item.className,
            item.type ? `btn-${item.type}` : '',
            { disabled: item.disabled })}
          // formType={item.disabled ? '' : item.formType}
          onClick={item.disabled ? noop : (e) => {
            if (typeof onClick === 'function') {
              // 兼容 Form 那边的老逻辑
              onClick({ detail: { item, index } });
            } else if (typeof item.onClick === 'function') {
              item.onClick(e);
            }
          }}
        >
          {item.icon && (
            <img
              src={item.icon}
              className="btn-icon"
              alt=""
            />
          )} {item.btnText}
        </div>
      ))}
    </div>
  );
}
