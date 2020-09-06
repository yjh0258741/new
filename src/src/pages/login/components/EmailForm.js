import React, { useEffect, useState } from 'react';
import SectionList from '@src/components/SectionList/SectionList';
import SectionItem from '@src/components/SectionList/SectionItem';
import { useFormControl } from '@src/hooks/useFormControl';
import { isNumber, isMail, countDown } from '@src/lib/utillib';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';
import { sendEmailVerifyCode } from '@src/models';
import { LoginType, UserNotExistTip, LanguageMap } from '@src/constants/login';
import { PageLanguage } from '@src/constants/common';
import classNames from 'classnames';

export default function EmailForm({
  components,
  language,
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
        throw LanguageMap[language || PageLanguage.Chinese].emailErrorTip;
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
        components.tips.showInfo(UserNotExistTip[language], { duration: 3000 });
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
          { required: true, message: LanguageMap[language || PageLanguage.Chinese].emailHint },
          { validate: isMail, message: LanguageMap[language || PageLanguage.Chinese].emailErrorTip },
        ],
      },
    ];

    if (loginType === LoginType.VerificationCode) {
      formConfig.push({
        name: 'verifyCode',
        value: '',
        rules: [
          { required: true, message: LanguageMap[language || PageLanguage.Chinese].codeTip },
          { validate: (v) => /^[0-9]{6}$/.test(v), message: LanguageMap[language || PageLanguage.Chinese].codeErrorTip },
        ],
      });
    }

    if (loginType === LoginType.Password) {
      formConfig.push({
        name: 'password',
        value: '',
        rules: [
          { required: true, message: LanguageMap[language || PageLanguage.Chinese].pwdHint },
        ],
      });
    }

    updateFormConfig(formConfig);
  }, [loginType]);

  return (
    <>
      <SectionList>
        <SectionItem
          label={LanguageMap[language || PageLanguage.Chinese].email}
          textAlign="left"
        >
          <input
            placeholder={LanguageMap[language || PageLanguage.Chinese].emailHint}
            autoComplete="off"
            type="email"
            onChange={(e) => onFieldChange({
              index: 0,
              name: 'email',
              value: e.target.value,
            })}
          />
        </SectionItem>

        {loginType === LoginType.VerificationCode && (
          <SectionItem
            label={LanguageMap[language || PageLanguage.Chinese].code}
            textAlign="left"
          >
            <input
              placeholder={LanguageMap[language || PageLanguage.Chinese].codeHint}
              autoComplete="off"
              type="tel"
              maxLength={6}
              style={{
                marginRight: '200rpx',
              }}
              placeholderclass="form-placeholder"
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
                <span>{LanguageMap[language || PageLanguage.Chinese].getCode}</span>
              ) : countdownInfo.countdownLeft ? (
                <span>{LanguageMap[language || PageLanguage.Chinese].resend}{countdownInfo.countdownLeft}s</span>
              ) : (
                <span>{LanguageMap[language || PageLanguage.Chinese].sending}…</span>
              )}
            </div>
          </SectionItem>
        )}

        {loginType === LoginType.Password && (
          <SectionItem
            label={LanguageMap[language || PageLanguage.Chinese].password}
            textAlign="left"
          >
            <input
              placeholder={LanguageMap[language || PageLanguage.Chinese].pwdHint}
              autoComplete="off"
              type="password"
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
            btnText: LanguageMap[language || PageLanguage.Chinese].login,
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
