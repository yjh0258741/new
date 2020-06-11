import React, { useEffect, useState } from 'react';
import SectionList from '@src/components/SectionList/SectionList';
import SectionItem from '@src/components/SectionList/SectionItem';
import { useFormControl } from '@src/hooks/useFormControl';
import { isNumber, isMail } from '@src/lib/utillib';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';

export default function EmailForm({
  components,
  onSubmit,
}) {

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
        name: 'email',
        value: '',
        rules: [
          { required: true, message: '请填写邮箱' },
          { validate: isMail, message: '请填写正确的邮箱' },
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
          UserType: 'email',
          Email: formData.email,
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
          label="邮箱"
          textAlign="left"
        >
          <input
            placeholder="请输入邮箱"
            autoComplete="off"
            type="tel"
            value={state.formData.email}
            onChange={e => onFieldChange({
              index: 0,
              name: 'email',
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
              index: 1,
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
