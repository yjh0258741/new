import classNames from 'classnames';
import { noop } from '../../lib/utillib';
import './SectionItem.less';

export default function SectionItem({
  onClick,
  label,
  labelWidth = 100,
  labelLineHeight = 24,
  labelIcon,
  textAlign = 'right',
  children,
  hideBorderBottom = false,
  textOverflow = true,
  clickable: initClickable,
  needHover = true,
  redSuffix = '',
  openType,
}) {
  const clickable = typeof initClickable === 'undefined' ? !!onClick : initClickable;

  return (
    <div
      role="textbox"
      className={classNames('section-item', {
        'need-hover': needHover,
        'border-bottom': !hideBorderBottom,
        'align-right': textAlign === 'right',
      })}
      onClick={clickable && !!onClick ? onClick : noop}
    >
      <div
        className={classNames('section-item_inner', {
          'append-arrow': clickable,
        })}
      >
        <div
          className="item-label text-overflow"
          style={{
            width: typeof labelWidth === 'string' ? labelWidth : `${labelWidth}px`,
            lineHeight: `${labelLineHeight}px`,
          }}
        >
          {!!labelIcon && (
            <img
              className="item-label-icon"
              src={labelIcon}
              alt=""
            />
          )}

          {/* 真机中需将text-overflow设置到此层才能生效 */}
          <div className="label-text text-overflow">
            {label}
            {redSuffix && <span style={{ color: 'red' }}>{ redSuffix }</span>}
          </div>
        </div>

        <div
          className={classNames('item-content', {
            'text-overflow': textOverflow,
          })}
          style={{
            marginLeft: typeof labelWidth === 'string' ? labelWidth : `${labelWidth + 10}px`,
            marginRight: `${clickable ? 18 : 0}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
