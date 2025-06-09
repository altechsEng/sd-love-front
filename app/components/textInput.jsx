import React from "react"
import { View, TouchableOpacity, TextInput } from "react-native"
import { PostScreenEmojiPicker, TextInputAddress, TextInputCity, TextInputEmail, TextInputEye, TextInputLock, TextInputPerson, TextInputPhone, TextInputArrowDownCircle, TextInputSearch, AccountSecurityScreenKey } from "./vectors"
import { FAMILLY, TEXT_SIZE } from "../../utils/constants"

export default function CustomTextInput({ name, secure, directState, placeHolder, setState, state, LeftIcon, RightIcon, LeftIconStyles, RightIconStyles, rightIconAction }) {

  return (< >

    {LeftIcon == "face" && <TouchableOpacity style={{ ...LeftIconStyles }}><PostScreenEmojiPicker /></TouchableOpacity>}
    {LeftIcon == "search" && <TouchableOpacity style={{ ...LeftIconStyles }}><TextInputSearch /></TouchableOpacity>}
    {RightIcon == "arrow" && <TouchableOpacity onPress={() => rightIconAction()} style={{ ...RightIconStyles }}><TextInputArrowDownCircle /></TouchableOpacity>}
    {LeftIcon == "email" && <TouchableOpacity style={{ ...LeftIconStyles }}><TextInputEmail /></TouchableOpacity>}
    {LeftIcon == "city" && <TouchableOpacity style={{ ...LeftIconStyles }}><TextInputCity /></TouchableOpacity>}
    {LeftIcon == "address" && <TouchableOpacity style={{ ...LeftIconStyles }}><TextInputAddress /></TouchableOpacity>}
    {LeftIcon == "person" && <TouchableOpacity style={{ ...LeftIconStyles }}><TextInputPerson /></TouchableOpacity>}
    {LeftIcon == "lock" && <TouchableOpacity style={{ ...LeftIconStyles }}><TextInputLock /></TouchableOpacity>}
    {LeftIcon == "phone" && <TouchableOpacity style={{ ...LeftIconStyles }}><TextInputPhone /></TouchableOpacity>}
    {LeftIcon == "key" && <TouchableOpacity style={{ ...LeftIconStyles }}><AccountSecurityScreenKey /></TouchableOpacity>}
    {RightIcon == "eye" && <TouchableOpacity style={{ ...RightIconStyles }}><TextInputEye /></TouchableOpacity>}

    <TextInput
      style={{
        fontSize: TEXT_SIZE.primary,
        fontFamily: FAMILLY.regular,
        color: "#818181",
        marginTop: 3,
        width: "100%"
      }}
      placeholderTextColor="#818181"
      placeholder={placeHolder}
      onChangeText={(text) => {
        if (directState) setState(text)
        else setState(text)
      }}
      name={name}
      value={state}
      secureTextEntry={secure}
    ></TextInput>
  </>)

}