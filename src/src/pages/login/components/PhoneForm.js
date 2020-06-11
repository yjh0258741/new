import React, { useEffect, useState } from 'react';
import SectionList from '@src/components/SectionList/SectionList';
import SectionItem from '@src/components/SectionList/SectionItem';
import { useFormControl } from '@src/hooks/useFormControl';
import { useCountryCodePicker } from '@src/hooks/useCountryCodePicker';
import { isNumber } from '@src/lib/utillib';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';

export default function PhoneForm({
  components,
  onSubmit,
}) {

  const countryCodeList = useCountryCodePicker();

  const [state, {
    onFieldChange,
    validate,
    doSubmit,
    updateFormConfig,
    updateFieldStatus,
    updateFormData,
    checkFormChanged,
  }] = useFormControl({
    formConfig: [
      {
        name: 'areaCode',
        value: '86',
      },
      {
        name: 'phoneNumber',
        value: '',
        rules: [
          { required: true, message: '请填写手机号' },
          { validate: isNumber, message: '请填写合法的手机号' },
        ],
      },
      {
        name: 'password',
        value: '',
        rules: [
          { required: true, message: '请填写密码' },
        ],
      },
    ],
    async onSubmit(formData) {
      try {
        console.log('formData', formData)

        await onSubmit({
          UserType: 'phone',
          CountryCode: formData.areaCode,
          PhoneNumber: formData.phoneNumber,
          Password: formData.password,
        });

      } catch (err) {
        components.tips.showError(err);
      }
    },
  });

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

  return (
    <>
      <SectionList>
        <SectionItem
          label="国家/地区"
          textAlign="left"
          clickable={true}
        >
          <select
            className="area-selector"
            name="areaCode"
            id="areaCode"
            value={state.formData.areaCode}
            onChange={e => onFieldChange({
              index: 0,
              name: 'areaCode',
              value: e.target.value,
            })}
          >
            {countryCodeList.map(item => (
              <option value={item.value} key={item.text}>{item.text}</option>
            ))}
          </select>
        </SectionItem>
        <SectionItem
          label="手机号"
          textAlign="left"
        >
          <input
            placeholder="请输入手机号码"
            autoComplete="off"
            type="tel"
            value={state.formData.phoneNumber}
            onChange={e => onFieldChange({
              index: 1,
              name: 'phoneNumber',
              value: e.target.value,
            })}
          />
        </SectionItem>
        <SectionItem
          label="密码"
          textAlign="left"
        >
          <input
            placeholder="请输入密码"
            autoComplete="off"
            type="password"
            value={state.formData.password}
            onChange={e => onFieldChange({
              index: 2,
              name: 'password',
              value: e.target.value,
            })}
          />
        </SectionItem>
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
};
