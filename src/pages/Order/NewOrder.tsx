import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import {CalenderIcon, EnvelopeIcon, EyeCloseIcon, EyeIcon, TimeIcon} from "../../icons";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import ComponentCard from "../../components/common/ComponentCard";
import React, {useState} from "react";
import Select from "../../components/form/Select";
import Form from "../../components/form/Form";
import Loader from "../UiElements/Loader/Loader";

export default function NewOrder() {
    const [isLoading, setIsLoading] = useState(false);
    const countries = [
        {code: "US", label: "+1"},
        {code: "GB", label: "+44"},
        {code: "CA", label: "+1"},
        {code: "AU", label: "+61"},
    ]
    const options = [
        {value: "marketing", label: "Marketing"},
        {value: "template", label: "Template"},
        {value: "development", label: "Development"},
    ];

    const [showPassword, setShowPassword] = useState(false);

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const handleSubmit = () => {
        console.log("Submitted");
    };

    const handlePhoneNumberChange = (phoneNumber: string) => {
        console.log("Updated phone number:", phoneNumber);
    };
    return (
        <Loader isLoading={isLoading}>
            <PageMeta
                title="New Order | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="New Order"/>
            <Form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="space-y-6">

                        <ComponentCard title="Order Info">
                            <div className="space-y-6">
                                <div>
                                    <Label>Input</Label>
                                    <Input type="text"/>
                                </div>
                                <div>
                                    <Label>Input with Placeholder</Label>
                                    <Input type="text" placeholder="info@gmail.com"/>
                                </div>
                                <div>
                                    <Label>Select Input</Label>
                                    <Select
                                        options={options}
                                        placeholder="Select an option"
                                        onChange={handleSelectChange}
                                        className="dark:bg-dark-900"
                                    />
                                </div>
                                <div>
                                    <Label>Password Input</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="datePicker">Date Picker Input</Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            id="datePicker"
                                            name="datePicker"
                                            onChange={(e) => console.log(e.target.value)}
                                        />
                                        <span
                                            className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                      <CalenderIcon/>
                                    </span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="tm">Date Picker Input</Label>
                                    <div className="relative">
                                        <Input
                                            type="time"
                                            id="tm"
                                            name="tm"
                                            onChange={(e) => console.log(e.target.value)}
                                        />
                                        <span
                                            className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <TimeIcon/>
            </span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="tm">Input with Payment</Label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Card number"
                                            className="pl-[62px]"
                                        />
                                        <span
                                            className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6.25" cy="10" r="5.625" fill="#E80B26"/>
                <circle cx="13.75" cy="10" r="5.625" fill="#F59D31"/>
                <path
                    d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                    fill="#FC6020"
                />
              </svg>
            </span>
                                    </div>
                                </div>
                            </div>
                        </ComponentCard>

                        {/*<SelectInputs />*/}
                        {/*<TextAreaInput />*/}
                        {/*<InputStates />*/}
                    </div>
                    <div className="space-y-6">


                        <ComponentCard title="Customer">
                            <div className="space-y-6">
                                <div>
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="info@gmail.com"
                                            type="text"
                                            className="pl-[62px]"
                                        />
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                      <EnvelopeIcon/>
                                    </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <PhoneInput
                                        selectPosition="start"
                                        countries={countries}
                                        placeholder="+1 (555) 000-0000"
                                        onChange={handlePhoneNumberChange}
                                    />
                                </div>
                                {" "}
                                <div>
                                    <Label>Phone</Label>
                                    <PhoneInput
                                        selectPosition="end"
                                        countries={countries}
                                        placeholder="+1 (555) 000-0000"
                                        onChange={handlePhoneNumberChange}
                                    />
                                </div>
                            </div>
                        </ComponentCard>

                        {/*<FileInputExample />*/}
                        {/*<CheckboxComponents />*/}
                        {/*<RadioButtons />*/}
                        {/*<ToggleSwitch />*/}
                        {/*<DropzoneComponent />*/}
                    </div>
                </div>
            </Form>
        </Loader>

    );
}