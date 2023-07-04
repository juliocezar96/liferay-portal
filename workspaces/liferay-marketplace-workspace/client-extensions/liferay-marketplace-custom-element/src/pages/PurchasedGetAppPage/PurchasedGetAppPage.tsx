/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayAlert from "@clayui/alert";
import ClayButton from "@clayui/button";
import ClayForm, { ClayCheckbox, ClayInput } from "@clayui/form";
import ClayIcon from "@clayui/icon";
import ClayLabel from "@clayui/label";
import ClaySticker from "@clayui/sticker";
import { InputHTMLAttributes, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import emptyPictureIcon from "../../assets/icons/avatar.svg";
import { Header } from "../../components/Header/Header";
import BaseWrapper from "../../components/Input/base/BaseWrapper";
import zodSchema, { zodResolver } from "../../schema/zod";
import { updateMyUserAccount, updateUserImage } from "../../utils/api";
import ClayLink from "@clayui/link";

type Steps = {
  page: "onboarding" | "customerGateForm";
};

type PurchasedGetAppPage = {
  setStep: React.Dispatch<Steps>;
  user?: UserAccount;
};

type UserForm = z.infer<typeof zodSchema.newCustomer>;

type InputProps = {
  boldLabel?: boolean;
  disabled?: boolean;
  errors?: any;
  id?: string;
  label?: string;
  name: string;
  register?: any;
  required?: boolean;
  type?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const { origin } = window.location;

const acceptedImageFormat = ["image/jpeg", "image/bmp", "image/png"];

const Input: React.FC<InputProps> = ({
  boldLabel,
  disabled = false,
  errors = {},
  label,
  name,
  register = () => {},
  id = name,
  type,
  value,
  required = false,
  onBlur,
  ...otherProps
}) => (
  <BaseWrapper
    boldLabel={boldLabel}
    disabled={disabled}
    error={errors[name]?.message}
    id={id}
    label={label}
    required={required}
  >
    <ClayInput
      className="rounded-xs"
      component={type === "textarea" ? "textarea" : "input"}
      disabled={disabled}
      id={id}
      name={name}
      type={type}
      value={value}
      {...otherProps}
      {...register(name, { onBlur, required })}
    />
  </BaseWrapper>
);

const PurchasedGetAppPage: React.FC<PurchasedGetAppPage> = ({
  setStep,
  user,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<UserForm>({
    defaultValues: {
      ...user,
      accountBriefs: user?.accountBriefs,
      emailAddress: user?.emailAddress,
      familyName: user?.familyName,
      givenName: user?.givenName,
      image: user?.image ?? emptyPictureIcon,
      imageBlob: "",
      newsSubscription: user?.newsSubscription,
    },
    resolver: zodResolver(zodSchema.newCustomer),
  });

  const _submit = async (form: UserForm) => {
    try {
      if (form.imageBlob) {
        const formData = new FormData();

        formData.append("image", form.imageBlob);

        await updateUserImage(Number(user?.id), formData);
      }

      delete form.imageBlob;
      delete form.image;

      await updateMyUserAccount(Number(user?.id), form);

      window.location.href = `${origin}/web/marketplace/loading`;
    } catch (error) {
      console.error(error);
    }
  };

  const inputProps = {
    errors,
    register,
    required: true,
  };

  const handleClick = () => {
    inputRef?.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputElement = event.target as HTMLInputElement;
    const fileList = inputElement?.files;

    const fileObj: File = fileList?.[0] as File;

    const getIsResourceFromAPI = (apis: string[]) =>
      apis.some((api) => fileObj.type.toString().includes(api));

    if (!fileObj) {
      return;
    }

    if (fileObj.size > 300000) {
      return setError("image", {
        message: "The image could not be greater than 300kb",
      });
    }

    if (!getIsResourceFromAPI(acceptedImageFormat)) {
      return setError("image", {
        message: "This file is not an image",
      });
    }

    const userImageURL = URL.createObjectURL(fileObj);

    setValue("image", userImageURL);

    clearErrors();

    setValue("imageBlob", fileObj);
  };

  const newsSubscription = watch("newsSubscription");

  return (
    <div className="customer-gate-page-container ">
      <div className="purchased-get-app-page-body border rounded p-8">
        <Header description title="Marketplace Account Creation" />

        <ClayForm>
          <div className="align-items-baseline d-flex">
            <div className="align-items-center d-flex">
              <label className="font-weight-bold mr-4 title-label">
                Profile Info
              </label>
            </div>
          </div>

          <hr className="solid" />

          {errors?.image?.message && (
            <ClayAlert displayType="danger">
              {errors?.image?.message.toString()}
            </ClayAlert>
          )}

          <ClayForm.Group>
            <div className="d-flex justify-content-between">
              <div className="form-group pr-3 w-50 mb-0">
                <Input
                  disabled
                  {...inputProps}
                  boldLabel
                  label="First Name"
                  name="givenName"
                />
              </div>

              <div className="form-group pl-3 w-50 mb-0">
                <Input
                  disabled
                  {...inputProps}
                  boldLabel
                  label="Last Name"
                  name="familyName"
                />
              </div>
            </div>

            <div className="form-group mb-5">
              <Input {...inputProps} boldLabel label="Company" name="company" />
            </div>

            <div className="form-group mb-5">
              <Input
                {...inputProps}
                boldLabel
                label="Industry"
                name="industry"
              />
            </div>

            <ClayForm.Group>
              <div className="align-items-baseline d-flex">
                <div className="align-items-center d-flex">
                  <label
                    className="font-weight-bold mr-4 title-label"
                    htmlFor="emailAddress"
                  >
                    Contact Info
                  </label>
                </div>
              </div>

              <hr className="solid" />

              <div className="form-group mb-5">
                <Input
                  {...inputProps}
                  boldLabel
                  label="Email"
                  name="emailAddress"
                  type="email"
                />
              </div>
              <label className="required" htmlFor="phone">
                Phone
              </label>
              <div className="align-items-center d-flex justify-content-between">
                <div>
                  <Input {...inputProps} id="phone" name="phoneCode" />
                  <div className="form-feedback-group">
                    <div className="form-text">Intl. code</div>
                  </div>
                </div>
                <div>
                  <Input {...inputProps} name="phoneNumber" />
                  <div className="form-feedback-group">
                    <div className="form-text">Phone number</div>
                  </div>
                </div>
                <div>
                  <Input {...inputProps} name="extension" />
                  <div className="form-feedback-group">
                    <div className="form-text">Extension (optional)</div>
                  </div>
                </div>
              </div>
            </ClayForm.Group>

            <ClayForm.Group>
              <div className="d-flex flex-row-reverse justify-content-end">
                <label
                  className="control-label ml-3 pb-1"
                  htmlFor="newsSubscription"
                >
                  I agree to the <ClayLink>Terms & Conditions</ClayLink>
                </label>

                <ClayCheckbox
                  checked={newsSubscription}
                  id="newsSubscription"
                  onChange={() =>
                    setValue("newsSubscription", !newsSubscription)
                  }
                />
              </div>
            </ClayForm.Group>

            <div className="customer-gate-page-button-container">
              <div className="align-items-center d-flex justify-content-between mb-4 w-100">
                <div>
                  <ClayButton
                    displayType="secondary"
                    onClick={() => {
                      window.location.href = origin;
                    }}
                  >
                    Cancel
                  </ClayButton>
                </div>

                <ClayButton onClick={handleSubmit(_submit)}>
                  Continue
                </ClayButton>
              </div>
            </div>
          </ClayForm.Group>
        </ClayForm>
      </div>
    </div>
  );
};

export default PurchasedGetAppPage;
