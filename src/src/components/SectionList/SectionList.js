import classNames from 'classnames';
import './SectionList.less';

export default function SectionList({
  title,
  marginTop = 20,
  children,
  className,
}) {
  return (
    <div
      className={classNames('section-list-container', className)}
      style={{
        marginTop: `${marginTop}rpx`,
      }}
    >
      {!!title && (
        <div className="section-title">{title}</div>
      )}

      <div
        className={classNames('section-list')}
      >
        {children}
      </div>
    </div>
  );
}
