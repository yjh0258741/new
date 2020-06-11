import React, { useState, useReducer, useRef } from 'react';
import { isNumeric, noop, validateFormField } from '@src/lib/utillib';
const _ = require('lodash/core');
const { isEqual } = _;

const validateField = ({ formData, fieldConfig }) => {
  const fieldItemStatus = {};

  const errMsg = validateFormField({
    formData,
    name: fieldConfig.name,
    value: formData[fieldConfig.name],
    fieldConfig,
  });

  fieldItemStatus.touched = true;

  if (errMsg) {
    fieldItemStatus.message = errMsg;
    fieldItemStatus.error = true;
  } else {
    fieldItemStatus.message = '';
    fieldItemStatus.error = false;
  }

  fieldItemStatus.status = fieldConfig.rules && (fieldItemStatus.touched ? (fieldItemStatus.error ? 'error' : 'success') : '');

  fieldItemStatus.message = fieldItemStatus.message || fieldConfig.message;

  return fieldItemStatus;
};

const validateForm = ({ formConfig, formData }) => {
  const fieldStatus = {};
  let formValid = true;

  formConfig.forEach((config) => {
    const fieldItemStatus = validateField({
      formData,
      fieldConfig: config,
    });

    if (fieldItemStatus.error) {
      formValid = false;
    }

    fieldStatus[config.name] = fieldItemStatus;
  });

  return { fieldStatus, formValid };
};

// 这些类型默认垂直居中
const defaultAlignCenterType = [
  'input', 'cascadeSelector', 'segment', 'custom', 'inputNumber',
];

function initForm(formConfig, initialData, opts = {}) {
  if (!initialData) {
    initialData = {};
  }

  const data = {
    formData: {},
    fieldStatus: {},
    formConfig: [],
    submitting: false,
  };

  if (typeof opts.showStatusIcon !== 'undefined') {
    data.showStatusIcon = opts.showStatusIcon;
  }

  formConfig.forEach((item) => {
    let required = false;

    if (item.rules && item.rules.length) {
      required = item.rules.find(rule => rule.required);
    }

    let align = item.align;

    if ((defaultAlignCenterType.indexOf(item.type) > -1) && !item.align) {
      align = 'middle';
    }

    const config = {
      ...item,
      align,
      required,
    };

    if (typeof opts.showStatusIcon !== 'undefined') {
      config.showStatusIcon = opts.showStatusIcon;
    }

    data.formConfig.push(config);

    // 如果有传 initialFormData，则优先从里面取值，其次从formConfig 中取值
    const initValue = (initialData.formData && item.name in initialData.formData) ? initialData.formData[item.name] : item.value;

    // 注意初始值取值
    switch (item.type) {
      case 'input':
      case 'textarea':
        data.formData[item.name] = initValue || '';
        break;
      case 'cascadeSelector':
        data.formData[item.name] = initValue || [];
        break;
      case 'inputNumber': {
        let val = initValue || 0;

        // 校验一下初始value，并初始化
        if (isNumeric(item.min) && val < item.min) {
          val = item.min;
        } else if (isNumeric(item.max) && val > item.max) {
          val = item.max;
        }

        data.formData[item.name] = val;
        break;
      }
      default:
        data.formData[item.name] = initValue;
        break;
    }

    data.fieldStatus[item.name] = initialData.fieldStatus && initialData.fieldStatus[item.name] ? initialData.fieldStatus[item.name] : {
      touched: false,
      // TODO: 有场景再说
      // active: false,
      // validating: false,
      error: false,
      message: item.message || '',
    }
  });

  return data;
}

function reducer(state, action) {
  const { type, payload } = action;
  const { fieldStatus, formData, formConfig } = state;

  // console.log('action => ', action.type, payload);
  // console.log('prev state => ', state);

  const nextState = (() => {
    switch (type) {
      // 1. 更新 formData
      // 2. validate value
      // 3. 更新 fieldStatus
      case 'change': {
        const { index, name, value, fieldItemStatus, fieldStatus: _fieldStatus } = payload;

        const nextState = {
          ...state,
          formData: {
            ...formData,
            [name]: value,
          },
        };

        if (_fieldStatus) {
          nextState.fieldStatus = _fieldStatus;
        } else if (fieldItemStatus) {
          nextState.fieldStatus[name] = fieldItemStatus;
        }

        return nextState;
      }
      case 'updateFormConfig': {
        return initForm(payload.formConfig, state, { showStatusIcon: state.showStatusIcon });
      }
      case 'validate': {
        const { fieldStatus } = payload;

        return {
          ...state,
          fieldStatus,
        };
      }
      case 'submitStart':
        return {
          ...state,
          submitting: true,
        };
      case 'submitEnd':
        return {
          ...state,
          submitting: false,
        };
      // 非全量更新，一个一个validate后插入state
      case 'updateFormData': {
        const { formData: date2update, validateImmediate, resetTouch } = payload;

        const nextFormData = Object.assign({}, formData, date2update);
        const nextFieldStatus = { ...fieldStatus };

        formConfig.forEach((fieldConfig) => {
          if (fieldConfig.name in date2update) {
            if (validateImmediate) {
              const fieldItemStatus = validateField({
                formData: date2update,
                fieldConfig,
              });

              nextFieldStatus[fieldConfig.name] = fieldItemStatus;
            } else {
              nextFieldStatus[fieldConfig.name] = {
                touched: !resetTouch,
                error: false,
                message: fieldConfig.message || '',
              };
            }
          }
        });

        return {
          ...state,
          formData: nextFormData,
          fieldStatus: nextFieldStatus,
        };
      }
      case 'updateFieldStatus': {
        const { name, fieldStatus: nextFieldStatus } = payload;

        return {
          ...state,
          fieldStatus: {
            ...fieldStatus,
            [name]: Object.assign({}, fieldStatus[name], nextFieldStatus),
          },
        }
      }
      default:
        console.warn('Dispatch unknown action!', type);
        return state;
    }
  })();

  // console.log('next state => ', nextState);

  return nextState;
}

export const useFormControl = (opts) => {
  const {
    formConfig = [],
    onSubmit = noop,
    onChange = noop,
    onError = noop,
    showStatusIcon,
  } = opts || {};

  const submittingRef = useRef(false);
  const [state, dispatch] = useReducer(reducer, initForm(formConfig, null, { showStatusIcon }));

  const validate = () => {
    const { formConfig, formData } = state;

    const { fieldStatus, formValid } = validateForm({ formConfig, formData });

    dispatch({ type: 'validate', payload: { fieldStatus } });

    return formValid;
  };

  const showError = () => {
    const nameArr = Object.keys(state.fieldStatus);

    for (let i = 0, l = nameArr.length; i < l; i++) {
      if (state.fieldStatus[nameArr[i]].error && state.fieldStatus[nameArr[i]].message) {
        onError(state.fieldStatus[nameArr[i]].message);
        return;
      }
    }
  };

  return [
    state,
    {
      onFieldChange({ index, name, value }) {
        const { formConfig, formData } = state;

        const fieldConfig = formConfig[index];

        const payload = {
          index,
          name,
          value,
        };

        const changeInfo = {
          formData: {
            ...formData,
            [name]: value,
          },
          name,
          value,
        };

        payload.fieldItemStatus = validateField({
          ...changeInfo,
          fieldConfig,
        });

        dispatch({
          type: 'change',
          payload,
        });

        onChange && onChange(changeInfo);
      },
      validate,
      async doSubmit() {
        const isValid = validate();

        if (!isValid) {
          showError();
          return;
        }

        if (submittingRef.current) return;

        submittingRef.current = true;

        dispatch({ type: 'submitStart' });

        try {
          onSubmit && await onSubmit(state.formData);
        } finally {
          submittingRef.current = false;
          dispatch({ type: 'submitEnd' });
        }
      },
      updateFormConfig(formConfig) {
        dispatch({
          type: 'updateFormConfig',
          payload: {
            formConfig,
          },
        });
      },
      updateFormData(formData, {
        validateImmediate = true,
        resetTouch = true,
      } = {}) {
        dispatch({
          type: 'updateFormData',
          payload: {
            formData,
            validateImmediate,
            resetTouch,
          },
        });
      },
      updateFieldStatus(name, fieldStatus) {
        dispatch({
          type: 'updateFieldStatus',
          payload: {
            name,
            fieldStatus,
          },
        });
      },
      checkFormChanged: initialFormData => !isEqual(initialFormData, state.formData),
    },
  ];
};
