import React, { useEffect, useState } from 'react';
import SectionList from '@src/components/SectionList/SectionList';
import SectionItem from '@src/components/SectionList/SectionItem';
import { useFormControl } from '@src/hooks/useFormControl';
import { isNumber, isMail, countDown } from '@src/lib/utillib';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';
import { sendEmailVerifyCode } from '@src/models';
import { LoginType } from '@src/constants/login';
import classNames from 'classnames';

export default function EmailForm({
  components,
  onSubmit,
  loginType,
}) {
  const [countdownInfo, setCountdownInfo] = useState({
    sending: false,
    countdownLeft: 0,
  });

  const [state, {
    onFieldChange,
    validate,
    doSubmit,
    updateFormConfig,
    updateFieldStatus,
    updateFormData,
    checkFormChanged,
  }] = useFormControl({
    async onSubmit(formData) {
      try {
        console.log('formData', formData);
        await onSubmit({
          UserType: 'email',
          Email: formData.email,
          Password: formData.password,
          VerificationCode: formData.verifyCode,
        });
      } catch (err) {
        components.tips.showError(err);
      }
    },
  });

  const startCountdown = () => {
    countDown(
      Date.now() + (60 * 1000),
      (timeLeft) => setCountdownInfo({ ...countdownInfo, countdownLeft: Math.floor(timeLeft / 1000) }),
      () => setCountdownInfo({ ...countdownInfo, countdownLeft: 0 }),
    );
  };

  const doSendVerifyCode = async () => {
    try {
      if (countdownInfo.sending || countdownInfo.countdownLeft) return;

      if (!(state.formData.email && isMail(state.formData.email))) {
        throw '请填写正确的邮箱';
      }

      setCountdownInfo({
        ...countdownInfo,
        sending: true,
      });

      await sendEmailVerifyCode({
        Email: state.formData.email,
      });

      startCountdown();
    } catch (err) {
      setCountdownInfo({
        ...countdownInfo,
        sending: false,
      });

      if (err.code === 'InvalidParameterValue.ErrorUserNotExists') {
        components.tips.showInfo('账号未注册，请到腾讯连连完成注册后再尝试登陆');
      } else {
        components.tips.showError(err);
      }
    }
  };

  useEffect(() => {
    if (state.fieldStatus) {
      Object.keys(state.fieldStatus).some((name) => {
        if (state.fieldStatus[name].status === 'error') {
          components.tips.showError(state.fieldStatus[name].message);
          return true;
        }
      });
    }
  }, [state.fieldStatus]);

  useEffect(() => {
    const formConfig = [
      {
        name: 'email',
        value: '',
        rules: [
          { required: true, message: '请填写邮箱' },
          { validate: isMail, message: '请填写正确的邮箱' },
        ],
      },
    ];

    if (loginType === LoginType.VerificationCode) {
      formConfig.push({
        name: 'verifyCode',
        value: '',
        rules: [
          { required: true, message: '请填写邮箱验证码' },
          { validate: (v) => /^[0-9]{6}$/.test(v), message: '请填写6位数字验证码' },
        ],
      });
    }

    if (loginType === LoginType.Password) {
      formConfig.push({
        name: 'password',
        value: '',
        rules: [
          { required: true, message: '请填写密码' },
        ],
      });
    }

    updateFormConfig(formConfig);
  }, [loginType]);

  return (
    <>
      <SectionList>
        <SectionItem
          label="邮箱"
          textAlign="left"
        >
          <input
            placeholder="请输入邮箱"
            autoComplete="off"
            type="tel"
            // value={state.formData.email}
            onChange={(e) => onFieldChange({
              index: 0,
              name: 'email',
              value: e.target.value,
            })}
          />
        </SectionItem>

        {loginType === LoginType.VerificationCode && (
          <SectionItem
            label="验证码"
            textAlign="left"
          >
            <input
              placeholder="6位数字验证码"
              autoComplete="off"
              style={{
                marginRight: '200rpx',
              }}
              placeholderclass="form-placeholder"
              // value={state.formData.verifyCode}
              onChange={(e) => onFieldChange({
                index: 1,
                name: 'verifyCode',
                value: e.target.value,
              })}
            />
            <div
              role="button"
              className={classNames('text-link need-hover', {
                'text-muted': countdownInfo.sending || countdownInfo.countdownLeft,
              })}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              onClick={doSendVerifyCode}
            >
              {!countdownInfo.sending && !countdownInfo.countdownLeft ? (
                <span>获取验证码</span>
              ) : countdownInfo.countdownLeft ? (
                <span>重新发送{countdownInfo.countdownLeft}s</span>
              ) : (
                <span>发送中…</span>
              )}
            </div>
          </SectionItem>
        )}

        {loginType === LoginType.Password && (
          <SectionItem
            label="密码"
            textAlign="left"
          >
            <input
              placeholder="请输入密码"
              autoComplete="off"
              type="password"
              // value={state.formData.password}
              onChange={(e) => onFieldChange({
                index: 1,
                name: 'password',
                value: e.target.value,
              })}
            />
          </SectionItem>
        )}
      </SectionList>

      <BtnGroup
        containerClass="login-btn"
        buttons={[
          {
            btnText: '登录',
            type: 'primary',
            onClick: () => {
              doSubmit();
            },
          },
        ]}
      />
    </>
  );
}
