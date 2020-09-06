import React, { useEffect, useState } from 'react';
import SectionList from '@src/components/SectionList/SectionList';
import SectionItem from '@src/components/SectionList/SectionItem';
import { useFormControl } from '@src/hooks/useFormControl';
import { useCountryCodePicker } from '@src/hooks/useCountryCodePicker';
import { isNumber, countDown } from '@src/lib/utillib';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';
import { LoginType, UserNotExistTip, LanguageMap } from '@src/constants/login';
import { sendPhoneVerifyCode } from '@src/models';
import classNames from 'classnames';

export default function PhoneForm({
  components,
  language,
  onSubmit,
  loginType,
}) {
  const countryCodeList = useCountryCodePicker({ language });
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
        await onSubmit({
          UserType: 'phone',
          CountryCode: formData.areaCode,
          PhoneNumber: formData.phoneNumber,
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

      if (!(state.formData.phoneNumber && isNumber(state.formData.phoneNumber))) {
        throw LanguageMap[language || PageLanguage.Chinese].phoneErrorTip;
      }

      setCountdownInfo({
        ...countdownInfo,
        sending: true,
      });

      await sendPhoneVerifyCode({
        PhoneNumber: state.formData.phoneNumber,
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
        name: 'areaCode',
        value: '86',
      },
      {
        name: 'phoneNumber',
        value: '',
        rules: [
          { required: true, message: LanguageMap[language || PageLanguage.Chinese].phoneHint },
          { validate: isNumber, message: LanguageMap[language || PageLanguage.Chinese].phoneErrorTip },
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
          label={LanguageMap[language || PageLanguage.Chinese].region}
          textAlign="left"
          clickable={true}
        >
          <select
            className="area-selector"
            name="areaCode"
            id="areaCode"
            value={state.formData.areaCode}
            onChange={(e) => onFieldChange({
              index: 0,
              name: 'areaCode',
              value: e.target.value,
            })}
          >
            {countryCodeList.map((item) => (
              <option value={item.value} key={item.text}>{item.text}</option>
            ))}
          </select>
        </SectionItem>

        <SectionItem
          label={LanguageMap[language || PageLanguage.Chinese].phone}
          textAlign="left"
        >
          <input
            style={{ width: '100%' }}
            placeholder={LanguageMap[language || PageLanguage.Chinese].phoneHint}
            autoComplete="off"
            type="tel"
            onChange={(e) => onFieldChange({
              index: 1,
              name: 'phoneNumber',
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
                index: 2,
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
                index: 2,
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
