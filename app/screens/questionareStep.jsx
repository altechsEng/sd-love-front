import { COLORS, FAMILLY, TEXT_SIZE } from "../../utils/constants";
import React, { useEffect, useState } from "react"
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { Pressable, ScrollView } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { RedTick, TextInputArrowDownCircle, TextInputDate } from "../components/vectors";
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../components/text";
import dayjs from 'dayjs'
import CustomTextInput from "../components/textInput";
import { useGlobalVariable } from "../context/global";
import CountryPickerModal from "../components/modalPicker";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getEmojiFlag } from "countries-list";

import axios from "axios";





export function Questionaire({ navigation }) {

	const { setRegistrationData, registrationData, questionnaireData, setQuestionnaireData } = useGlobalVariable()

	useEffect(() => {
		// Calculate initial progress when component mounts
		const initialProgress = Object.values(questionnaireData.answered)
			.filter(answered => answered).length;
		setQuestionnaireProgress(initialProgress);
	}, []);

	// Update functions would look like this:
	const updateAnswer = (questionKey, value) => {
		setQuestionnaireData(prev => {
			const wasAnswered = prev.answered[questionKey];
			const isNowAnswered = value !== "" && value !== null &&
				(!Array.isArray(value) || value.length > 0);

			// Only update progress if answer state changed from unanswered to answered
			if (!wasAnswered && isNowAnswered) {
				setQuestionnaireProgress(prevProgress => prevProgress + 1);
			}
			// If answer changed from answered to unanswered, decrement progress
			else if (wasAnswered && !isNowAnswered) {
				setQuestionnaireProgress(prevProgress => prevProgress - 1);
			}

			return {
				answers: {
					...prev.answers,
					[questionKey]: value
				},
				answered: {
					...prev.answered,
					[questionKey]: isNowAnswered
				}
			};
		});
	};

	const handleMultiSelect = (questionKey, value, limit) => {
		setQuestionnaireData(prev => {
			// Safely get current values and limit
			const currentValues = Array.isArray(prev.answers[questionKey])
				? prev.answers[questionKey]
				: [];
			const maxLimit = limit;

			// Determine new values
			let newValues;
			if (currentValues.includes(value)) {
				// Remove if already selected
				newValues = currentValues.filter(v => v !== value);
			} else {
				// Add if under limit or no limit
				if (maxLimit === undefined || currentValues.length < maxLimit) {
					newValues = [...currentValues, value];
				} else {
					// At max limit - don't change
					return prev;
				}
			}

			// Calculate progress changes
			const wasAnswered = currentValues.length > 0;
			const isNowAnswered = newValues.length > 0;
			const progressDelta = !wasAnswered && isNowAnswered
				? 1
				: wasAnswered && !isNowAnswered
					? -1
					: 0;

			if (progressDelta !== 0) {
				setQuestionnaireProgress(prevProgress => prevProgress + progressDelta);
			}

			return {

				answers: {
					...prev.answers,
					[questionKey]: newValues
				},
				answered: {
					...prev.answered,
					[questionKey]: isNowAnswered
				}
			};
		});
	};

	// For array-type answers (like hobbies, love languages)
	const toggleArrayAnswer = (questionKey, value) => {
		setQuestionnaireData(prev => {
			const currentArray = prev.answers[questionKey] || [];
			const newArray = currentArray.includes(value)
				? currentArray.filter(item => item !== value)
				: [...currentArray, value];

			const wasAnswered = prev.answered[questionKey];
			const isNowAnswered = newArray.length > 0;

			// Update progress if needed
			if (!wasAnswered && isNowAnswered) {
				setQuestionnaireProgress(prevProgress => prevProgress + 1);
			} else if (wasAnswered && !isNowAnswered) {
				setQuestionnaireProgress(prevProgress => prevProgress - 1);
			}

			return {
				answers: {
					...prev.answers,
					[questionKey]: newArray
				},
				answered: {
					...prev.answered,
					[questionKey]: isNowAnswered
				}
			};
		});
	};

	const handleChange = (_, selectedDate) => {
		setShow(false)
		setShow(Platform.OS === "ios");
		if (selectedDate) {
			updateAnswer("qP2", selectedDate);
			setDate(selectedDate)
		}
	};

	const onSelect = (country) => {
		updateAnswer("qp9", country);
		setCountry(country)
	};

	const CustomQuestionDisplayer = ({ answers, direction, onSelect, currentValue }) => {
		let firstStyles = {}
		if (direction == "column") {
			firstStyles = { flexDirection: direction, alignItems: "flex-start", justifyContent: "center" }
		} else {
			firstStyles = { flexDirection: direction, alignItems: "center" }
		}
		return (<View>
			<View style={{ ...firstStyles, marginTop: 10 }}>
				{answers.map((an) => {
					return (<TouchableOpacity key={`${an}`} style={{ marginBottom: direction == "column" ? 10 : 0, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}
						onPress={async () => {
							onSelect(an)
						}}>
						<View className={'flex'} style={{ alignItems: "center", justifyContent: "center", marginRight: 10, height: 20, width: 20, borderColor: COLORS.primary, backgroundColor: currentValue == an ? COLORS.primary : 'transparent', borderWidth: 2, borderRadius: 50 }}>
							{/* <View style={{ height: 13, width: 13, backgroundColor: currentValue == an ? COLORS.primary : "white", borderRadius: 50 }}></View> */}
							{currentValue == an && (
								<Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
							)}
						</View>
						<Text className={'text-gray-400'} style={{ fontFamily: FAMILLY.regular, fontSize: TEXT_SIZE.medium, marginTop: 2, paddingRight: 20 }}>{an}</Text>
					</TouchableOpacity>)
				})}
			</View>
		</View>)
	}

	const { questioniareLevel, questionnaireProgress, setQuestionaireLevel, setQuestionnaireProgress } = useGlobalVariable()

	// const onSelect = (country:String) => {
	//      setCountry(country)
	// }
	const [country, setCountry] = useState({
		flag: getEmojiFlag('CM'),
		name: "Cameroon",
		dial_code: "+237"
	})
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);
	const [visible, setVisible] = useState(false)
	const [questionaireLevelLocal, setQuestionaireLevelLocal] = useState('1/2 Questions générales')
	const hobies = ["Voyages", "Sports", "Dances", "Cinéma", "Musées", "Conférences", "Politique", "Camping", "Nourritures", "Science", "Bouquins", "Musique"]

	const HobbiesSelect = ({
		hobbies,
		selectedHobbies = [],
		onSelect,
		minSelections = 5
	}) => {
		const toggleHobby = (hobby) => {
			const newSelection = selectedHobbies.includes(hobby)
				? selectedHobbies.filter(h => h !== hobby)
				: [...selectedHobbies, hobby];
			onSelect(newSelection);
		};

		return (
			<View>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					{hobbies.map(hobby => (
						<TouchableOpacity
							key={hobby}
							onPress={() => toggleHobby(hobby)}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: selectedHobbies.includes(hobby)
									? '#F5F6FC'
									: '#F5F6FC',
								paddingVertical: 5,
								paddingHorizontal: 12,
								borderRadius: 10,
								marginRight: 8,
								marginBottom: 8,
								borderWidth: 2,
								borderColor: selectedHobbies.includes(hobby)
									? '#FF5656'
									: '#F5F6FC'
							}}
						>
							{selectedHobbies.includes(hobby) && (
								<View style={{ marginRight: 5 }}>
									<RedTick />
								</View>
							)}
							<CustomRegularPoppingText
								value={hobby}
								color={'black'}
								fontSize={TEXT_SIZE.small}
							/>
						</TouchableOpacity>
					))}
				</View>


			</View>
		);
	}

	const handleHobbiesChange = (newHobbies) => {
		setQuestionnaireData(prev => {
			const wasAnswered = prev.answers.qP16.length > 0;
			const isNowAnswered = newHobbies.length > 0;

			// Update progress if needed
			if (!wasAnswered && isNowAnswered) {
				setQuestionnaireProgress(prev => prev + 1);
			} else if (wasAnswered && !isNowAnswered) {
				setQuestionnaireProgress(prev => prev - 1);
			}

			return {

				answers: {
					...prev.answers,
					qP16: newHobbies
				},
				answered: {
					...prev.answered,
					qP16: isNowAnswered
				}
			};
		});
	};

	const MultiSelectAnswer = ({
		questionKey,
		answers,
		direction = 'column',
		selectedValues = [],
		maxSelections,
		onSelect
	}) => {
		const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

		return (
			<View style={{
				marginTop: 10,
				flexDirection: direction,
				flexWrap: direction === 'row' ? 'wrap' : undefined,
				alignItems: direction === 'column' ? 'flex-start' : 'center'
			}}>
				{answers.map(answer => {
					const isSelected = safeSelectedValues.includes(answer);
					const isDisabled = maxSelections !== undefined &&
						safeSelectedValues.length >= maxSelections &&
						!isSelected;


					return (
						<TouchableOpacity
							key={answer}
							onPress={() => {
								console.log(isSelected, isDisabled, safeSelectedValues, answer, selectedValues, questionKey)
								return !isDisabled && onSelect(questionKey, answer, maxSelections)
							}}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 10,
								marginBottom: 10,
								opacity: isDisabled ? 0.5 : 1
							}}
							disabled={isDisabled}
						>
							<View style={{
								width: 20,
								height: 20,
								borderRadius: 10,
								borderWidth: 2,
								borderColor: COLORS.primary,
								backgroundColor: isSelected ? COLORS.primary : 'transparent',
								marginRight: 8,
								justifyContent: 'center',
								alignItems: 'center'
							}}>
								{isSelected && (
									<Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
								)}
							</View>
							<Text className={'text-gray-400'} style={{ fontFamily: FAMILLY.regular, fontSize: TEXT_SIZE.medium }}>
								{answer}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	};

	const [activeInterest, setActiveInterest] = useState('')
	const renderHobies = ({ item }) => {

		return (<TouchableOpacity onPress={() => setActiveInterest(item)} style={{ flexGrow: 2, marginRight: 5, marginBottom: 5, backgroundColor: "#F5F6FC", paddingVertical: 2, paddingHorizontal: 10, borderRadius: 10, alignItems: "center", justifyContent: "center", flexDirection: "row", borderWidth: 2, borderColor: activeInterest == item ? "#FF5656" : "#F5F6FC" }}>
			<View style={{ marginRight: 5 }}><RedTick /></View>
			<CustomRegularPoppingText value={item} color={'black'} fontSize={TEXT_SIZE.small} />
		</TouchableOpacity>)
	}

	return (
		<View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "white" }}>
				<View style={{ height: 50 }}></View>

				<View style={{ marginVertical: 10, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Quel est ton sexe :" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Homme", "Femme"]} direction={"row"} currentValue={questionnaireData.answers.qP1} onSelect={(value) => updateAnswer("qP1", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<Text style={{ fontFamily: FAMILLY.regular, fontSize: TEXT_SIZE.primary, marginBottom: 10 }}>Quel est ta date de naissance ?</Text>
					<View style={{ paddingVertical: 10, paddingHorizontal: 10, width: "100%", backgroundColor: "#F3F3F3", borderRadius: 10, flexDirection: "row", alignItems: "center" }}>
						<TouchableOpacity onPress={() => setShow(true)} style={{ alignSelf: "flex-start" }}><TextInputDate /></TouchableOpacity>
						<View style={{ marginTop: 2, marginLeft: 5 }}>
							<CustomRegularPoppingText value={dayjs(date).format('DD MMMM YYYY')} color={'black'} fontSize={TEXT_SIZE.primary} />
						</View>
					</View>
					{show && (
						<DateTimePicker
							value={date}
							mode="date"
							display="default"
							onChange={handleChange}
						/>
					)}
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Quel est ton état civil :" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Célibataire", "Divorcé(e)", "Veuf(ve)"]} direction={"row"} currentValue={questionnaireData.answers.qP3} onSelect={(value) => updateAnswer("qP3", value)} />
				</View>



				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="As-tu un ou des enfants :" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["oui", "non"]} direction={"row"} currentValue={questionnaireData.answers.qP4} onSelect={(value) => updateAnswer("qP4", value)} />
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value={`Es-tu à l’aise à rencontrer un partenaire qui a un ou des enfant(s) ?`} color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["oui", "non", "ça dépend"]} direction={"row"} currentValue={questionnaireData.answers.qP5} onSelect={(value) => updateAnswer("qP5", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText style={{ marginBottom: 10 }} value="Quelle est ta taille (En centimètres)" color={'black'} fontSize={TEXT_SIZE.primary} />
					<Pressable style={{ paddingVertical: 0, paddingHorizontal: 10, width: "100%", backgroundColor: "#F3F3F3", borderRadius: 20, flexDirection: "row", alignItems: "center" }}>
						<CustomTextInput rightIconAction={null} name="height" placeHolder="180" LeftIcon={null} LeftIconStyles={null} RightIcon={null} RightIconStyles={null} directState={true} setState={(text) => updateAnswer("qP6", text)} state={questionnaireData.answers.qP6} />
					</Pressable>
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Es-tu ouvert(e) à rencontrer un partenaire qui a une plus petite taille que toi ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["oui", "non", "ça dépend"]} direction={"row"} currentValue={questionnaireData.answers.qP7} onSelect={(value) => updateAnswer("qP7", value)} />
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Quelle est ton origine ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Arabe", "Asiatique", "Hispanique/Latino", "Noire (Afrique/Antilles)", "Blanc caucasien", "Métissé(e)", "autre"]} direction={"column"} currentValue={questionnaireData.answers.qP8} onSelect={(value) => updateAnswer("qP8", value)} />
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText style={{ marginBottom: 10 }} value="Quelle est ta nationalité ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<View style={{ position: "relative", borderRadius: 10, paddingVertical: 5, paddingHorizontal: 18, backgroundColor: "rgba(181, 181, 181, 0.12)", flexDirection: "row", alignItems: "center" }}>
						{visible && <CountryPickerModal type={'country'} title="Select country" visible={visible} onSelect={onSelect} onClose={() => setVisible(false)} />
						}
						<Text style={{ color: COLORS.gray, fontSize: TEXT_SIZE.title, fontFamily: FAMILLY.regular, textAlign: "center", marginTop: 5 }}>{country.flag}</Text>
						<Text style={{ paddingLeft: 12, fontSize: TEXT_SIZE.primary, color: COLORS.gray, fontFamily: FAMILLY.regular, textAlign: "center", marginTop: 5 }}>{country ? `${country?.name}` : "Cameroon"}</Text>

						<TouchableOpacity onPress={() => setVisible(true)} style={{ position: "absolute", right: 16, top: 12 }}><TextInputArrowDownCircle /></TouchableOpacity>
					</View>
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Es-tu ouvert(e) à rencontrer un partenaire qui a une nationalité différente de la tienne ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["oui", "non", "ça dépend"]} direction={"row"} currentValue={questionnaireData.answers.qP10} onSelect={(value) => updateAnswer("qP10", value)} />
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Quel est ton niveau d’études ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Collège", "Lycée", "Licence (Bachelor, Bac+3)", "Maitrise (Master)", "Doctorat", "autre"]} direction={"column"} currentValue={questionnaireData.answers.qP11} onSelect={(value) => updateAnswer("qP11", value)} />
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Es-tu à l’aise à rencontrer un partenaire qui a un niveau d’études inférieur au tien ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["oui", "non", "ça dépend"]} direction={"row"} currentValue={questionnaireData.answers.qP12} onSelect={(value) => updateAnswer("qP12", value)} />
				</View>


				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				{/* <View style={{marginVertical:20,paddingHorizontal:20}}>
          <CustomRegularPoppingText value="Quels sont tes principaux langages d’amour ?(deux choix maximum) " color={'black'} fontSize={TEXT_SIZE.primary}/>          
          <CustomQuestionDisplayer answers={["Moment de qualité","Toucher physique","Paroles valorisantes","Services rendus","Cadeaux"]} direction={"column"} currentValue={questionnaireData.answers.qP13} onSelect={(value) => updateAnswer("qP13", value)}/>
          </View> */}

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText
						value="Quels sont tes principaux langages d'amour ? (deux choix maximum)"
						color={'black'}
						fontSize={TEXT_SIZE.primary}
					/>
					<MultiSelectAnswer
						questionKey="qP13"
						answers={["Moment de qualité", "Toucher physique", "Paroles valorisantes", "Services rendus", "Cadeaux"]}
						direction="column"
						selectedValues={questionnaireData.answers.qP13}
						maxSelections={2}
						onSelect={handleMultiSelect}
					/>
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Quel est ton tempérament dominant ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Rouge (fonceur, indépendant, exigeant, factuel, positif…)", "Bleu (prudent, analytique, réservé, distant, organisé…)", "Vert (patient, fiable, calme, attentionné, protecteur…)", "Jaune (démonstratif, sociable, dynamique, enthousiaste, optimiste…)"]} direction={"column"} currentValue={questionnaireData.answers.qP14} onSelect={(value) => updateAnswer("qP14", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText
						value="Nomme les 5 choses les plus importantes pour toi dans une relation amoureuse :"
						color={'black'}
						fontSize={TEXT_SIZE.primary}
					/>
					<MultiSelectAnswer
						questionKey="qP15"
						answers={["Attirance physique", "Compatibilité sexuelle", "Avoir des discussions intellectuelles", "Le service pour Dieu", "Avoir les mêmes croyances spirituelles", "La tolérance de la foi de l’autre", "La sagesse", "La bienveillance"]}
						direction="column"
						selectedValues={questionnaireData.answers.qP15}
						maxSelections={5}
						onSelect={handleMultiSelect}
					/>
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View className={'gap-4'} style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText
						value="Mes centres d'intérêts (5 minimum)"
						color={'black'}
						fontSize={TEXT_SIZE.primary}
					/>

					<HobbiesSelect
						hobbies={hobies} // Your hobbies array
						selectedHobbies={questionnaireData.answers.qP16}
						onSelect={handleHobbiesChange}
						minSelections={5}
					/>
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3", marginVertical: 10 }}></View>

				<View style={{ height: 50, paddingHorizontal: 20 }}>
					<TouchableOpacity onPress={() => navigation.navigate("Questionaire2")} style={{ borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20 }}>
						<CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value="Suivant" />
					</TouchableOpacity>
				</View>
				<View style={{ height: 20 }}></View>
			</ScrollView>
		</View>)
}

export function Questionaire2({ navigation }) {

	const { questioniareLevel, err, setErr, registrationData, setQuestionaireLevel, setQuestionnaireProgress, questionnaireData, setQuestionnaireData } = useGlobalVariable()

	useEffect(() => {
		// Calculate initial progress when component mounts
		const initialProgress = Object.values(questionnaireData.answered)
			.filter(answered => answered).length;

		setQuestionnaireProgress(initialProgress);
	}, []);

	useEffect(() => {
		setTimeout(() => setErr(""), 2000)
	}, [err])


	const handleSubmission = async () => {
		setIsLoading(true)
		const data = {
			...registrationData,
			...questionnaireData?.answers,
			qP13: JSON.stringify(questionnaireData?.answers.qP13),
			qP15: JSON.stringify(questionnaireData?.answers.qP15),
			qP16: JSON.stringify(questionnaireData?.answers.qP16),
			qS10: JSON.stringify(questionnaireData?.answers.qS10),
		}
		await axios.post("/api/register/en", data).then((res) => {
			console.log(res.data, "resdata")
			if (res.data.errors) {
				setErr(`address: ${res.data.errors?.address}` || `city: ${res.data.errors?.city}`)
			} else if (res.data.status === 401) {
				setErr(`email error : ${res.data.message}`)
			} else {

				navigation.navigate("BottomTabsHome")
			}
			setIsLoading(false)
		}).catch((err) => {
			console.log(err, "opppp")
			setErr(err)
			setIsLoading(false)

		})
	}



	const MultiSelectAnswer = ({
		questionKey,
		answers,
		direction = 'column',
		selectedValues = [],
		maxSelections,
		onSelect
	}) => {
		const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

		return (
			<View style={{
				marginTop: 10,
				flexDirection: direction,
				flexWrap: direction === 'row' ? 'wrap' : undefined,
				alignItems: direction === 'column' ? 'flex-start' : 'center'
			}}>
				{answers.map(answer => {
					const isSelected = safeSelectedValues.includes(answer);
					const isDisabled = maxSelections !== undefined &&
						safeSelectedValues.length >= maxSelections &&
						!isSelected;


					return (
						<TouchableOpacity
							key={answer}
							onPress={() => {
								console.log(isSelected, isDisabled, safeSelectedValues, answer, selectedValues, questionKey)
								return !isDisabled && onSelect(questionKey, answer, maxSelections)
							}}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 10,
								marginBottom: 10,
								opacity: isDisabled ? 0.5 : 1
							}}
							disabled={isDisabled}
						>
							<View style={{
								width: 20,
								height: 20,
								borderRadius: 10,
								borderWidth: 2,
								borderColor: COLORS.primary,
								backgroundColor: isSelected ? COLORS.primary : 'transparent',
								marginRight: 8,
								justifyContent: 'center',
								alignItems: 'center'
							}}>
								{isSelected && (
									<Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
								)}
							</View>
							<Text className={'text-gray-400'} style={{ fontFamily: FAMILLY.regular, fontSize: TEXT_SIZE.medium }}>
								{answer}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	};


	const handleMultiSelect = (questionKey, value, limit) => {
		setQuestionnaireData(prev => {
			// Safely get current values and limit
			const currentValues = Array.isArray(prev.answers[questionKey])
				? prev.answers[questionKey]
				: [];
			const maxLimit = limit;

			// Determine new values
			let newValues;
			if (currentValues.includes(value)) {
				// Remove if already selected
				newValues = currentValues.filter(v => v !== value);
			} else {
				// Add if under limit or no limit
				if (maxLimit === undefined || currentValues.length < maxLimit) {
					newValues = [...currentValues, value];
				} else {
					// At max limit - don't change
					return prev;
				}
			}

			// Calculate progress changes
			const wasAnswered = currentValues.length > 0;
			const isNowAnswered = newValues.length > 0;
			const progressDelta = !wasAnswered && isNowAnswered
				? 1
				: wasAnswered && !isNowAnswered
					? -1
					: 0;

			if (progressDelta !== 0) {
				setQuestionnaireProgress(prevProgress => prevProgress + progressDelta);
			}

			return {

				answers: {
					...prev.answers,
					[questionKey]: newValues
				},
				answered: {
					...prev.answered,
					[questionKey]: isNowAnswered
				}
			};
		});
	};

	const [country, setCountry] = useState({
		flag: getEmojiFlag('CM'),
		name: "Cameroon",
		dial_code: "+237"
	})

	const [isLoading, setIsLoading] = useState(false)
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);
	const [visible, setVisible] = useState(false)
	const [questionaireLevelLocal, setQuestionaireLevelLocal] = useState('1/2 Questions générales')
	const hobies = ["Voyages", "Sports", "Dances", "Cinéma", "Musées", "Conférences", "Politique", "Camping", "Nourritures", "Science", "Bouquins", "Musique"]


	const updateAnswer = (questionKey, value) => {
		setQuestionnaireData(prev => {
			const wasAnswered = prev.answered[questionKey];
			const isNowAnswered = value !== "" && value !== null &&
				(!Array.isArray(value) || value.length > 0);

			// Only update progress if answer state changed from unanswered to answered
			if (!wasAnswered && isNowAnswered) {
				setQuestionnaireProgress(prevProgress => prevProgress + 1);
			}
			// If answer changed from answered to unanswered, decrement progress
			else if (wasAnswered && !isNowAnswered) {
				setQuestionnaireProgress(prevProgress => prevProgress - 1);
			}

			return {
				answers: {
					...prev.answers,
					[questionKey]: value
				},
				answered: {
					...prev.answered,
					[questionKey]: isNowAnswered
				}
			};
		});
	};

	const CustomQuestionDisplayer = ({ answers, direction, onSelect, currentValue }) => {
		let firstStyles = {}
		if (direction == "column") {
			firstStyles = { flexDirection: direction, alignItems: "flex-start", justifyContent: "center" }
		} else {
			firstStyles = { flexDirection: direction, alignItems: "center" }
		}
		return (<View>
			<View style={{ ...firstStyles, marginTop: 10 }}>
				{answers.map((an) => {
					return (<TouchableOpacity key={`${an}`} style={{ marginBottom: direction == "column" ? 10 : 0, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}
						onPress={async () => {
							onSelect(an)
						}}>
						<View className={'flex'} style={{ alignItems: "center", justifyContent: "center", marginRight: 10, height: 20, width: 20, borderColor: COLORS.primary, backgroundColor: currentValue == an ? COLORS.primary : 'transparent', borderWidth: 2, borderRadius: 50 }}>
							{/* <View style={{ height: 13, width: 13, backgroundColor: currentValue == an ? COLORS.primary : "white", borderRadius: 50 }}></View> */}
							{currentValue == an && (
								<Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
							)}
						</View>
						<Text className={'text-gray-400'} style={{ fontFamily: FAMILLY.regular, fontSize: TEXT_SIZE.medium, marginTop: 2, paddingRight: 20 }}>{an}</Text>
					</TouchableOpacity>)
				})}
			</View>
		</View>)
	}

	return (
		<View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "white" }}>
				<View style={{ height: 50 }}></View>

				<View className={'gap-3'} style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="En quelques mots, comment décrirais-tu ta relation avec Dieu (Ce que Jésus représente pour toi, le type d’église que tu fréquentes…) ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomRegularPoppingText value="C’est l’une des premières choses que les gens liront sur ton profil. Tu auras l’occasion d’en dire plus par la suite" color={null} fontSize={TEXT_SIZE.small} />

					<Pressable style={{ paddingVertical: 0, marginVertical: 0, borderRadius: 10, paddingHorizontal: 15, backgroundColor: "rgba(181, 181, 181, 0.12)" }}>
						<CustomTextInput rightIconAction={null} name="height" placeHolder="Ex: Gagner les âmes, mon combat" LeftIcon={null} LeftIconStyles={null} RightIcon={null} RightIconStyles={null} directState={true} setState={(text) => updateAnswer("qS1", text)} state={questionnaireData.answers.qS1} />
					</Pressable>
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Depuis combien de temps estimes tu que tu marches pleinement, de tout ton cœur avec le Seigneur ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Moins d’un an", "1 à 2 ans", "2 à 5 ans", "5 à 10 ans", "10 à 20 ans", "Plus de 20 ans"]} direction={"column"} currentValue={questionnaireData.answers.qS2} onSelect={(value) => updateAnswer("qS2", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Quelle est ta dénomination religieuse ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Catholique", "Calviniste", "Évangélique", "Charismatique", "Méthodiste", "Chrétien non pratiquant", "Non croyant"]} direction={"column"} currentValue={questionnaireData.answers.qS3} onSelect={(value) => updateAnswer("qS3", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Es-tu ouvert(e) à rencontrer un partenaire qui a une dénomination religieuse différente de la tienne ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["oui", "non", "ça dépend"]} direction={"row"} currentValue={questionnaireData.answers.qS4} onSelect={(value) => updateAnswer("qS4", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Es-tu baptisé(e) d’eau ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Oui, par immersion", "Oui, par aspersion mais sans confirmation", "Oui, par aspersion et avec confirmation", "non"]} direction={"column"} currentValue={questionnaireData.answers.qS5} onSelect={(value) => updateAnswer("qS5", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Es-tu baptisé(e) du Saint Esprit ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Oui et je parle en langues", "Oui, mais je ne parle pas en langues", "Je ne crois pas au baptême du Saint Esprit", "Je ne sais pas ce que cela veut dire", "non"]} direction={"column"} currentValue={questionnaireData.answers.qS6} onSelect={(value) => updateAnswer("qS6", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Es-tu un membre régulier d’une église locale, paroisse ou communauté ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Oui", "Non"]} direction={"row"} currentValue={questionnaireData.answers.qS7} onSelect={(value) => updateAnswer("qS7", value)} />
				</View>

				{
					questionnaireData.answers.qS7 === "Oui" && (
						<View>
							<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

							<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
								<View className={'flex flex-row mb-4'}>
									<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
										<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
									</View>
								</View>
								<CustomRegularPoppingText value="Si tu as répondu non à la question précédente, peux-tu donner la raison ?" color={'black'} fontSize={TEXT_SIZE.primary} />
								<CustomQuestionDisplayer answers={["Je recherche une église ", "Je préfère vivre ma foi à la maison", "Je fréquente plusieurs assemblées chrétiennes", "Autre"]} direction={"column"} currentValue={questionnaireData.answers.qS8} onSelect={(value) => updateAnswer("qS8", value)} />
								<Pressable style={{ paddingVertical: 0, marginVertical: 0, borderRadius: 10, paddingHorizontal: 15, backgroundColor: "rgba(181, 181, 181, 0.12)" }}>
									<CustomTextInput rightIconAction={null} name="height" placeHolder="Ta réponse ici" LeftIcon={null} LeftIconStyles={null} RightIcon={null} RightIconStyles={null} directState={true} setState={(text) => updateAnswer("qS8", text)} state={questionnaireData.answers.qS8} />
								</Pressable>
							</View>
						</View>
					)
				}

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>
				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Combien de fois par mois assistes tu généralement à un programme (culte, messe, ateliers, prières…) de l'église :" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Rarement : 1 fois", "Occasionnel : 2 fois", "Régulier : Plus de 4 fois", "Je ne vais pas aux programmes de l'église", "Ça dépend"]} direction={"column"} currentValue={questionnaireData.answers.qS9} onSelect={(value) => updateAnswer("qS9", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText
						value="Comment aimes-tu servir au sein de l’église locale ? (trois choix maximum)"
						color={'black'}
						fontSize={TEXT_SIZE.primary}
					/>
					<MultiSelectAnswer
						questionKey="qS10"
						answers={["Administration", "Addiction", "Art.", "Communication et Médias", "Sonorisation", "Éclairage", "Bébés et enfants"]}
						direction="column"
						selectedValues={questionnaireData.answers.qS10}
						maxSelections={3}
						onSelect={handleMultiSelect}
					/>
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Crois-tu en l’abstinence sexuelle avant le mariage ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Oui, et je compte fermement la respecter", "Non, j’ai mon avis sur ce sujet et je préfère en parler en privé avec la personne concernée", "Ça dépend"]} direction={"column"} currentValue={questionnaireData.answers.qS11} onSelect={(value) => updateAnswer("qS11", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>


				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Crois-tu au principe de la dîme (10% des revenus) qui est donnée à l’église ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Oui, je la donne systématiquement à l’église", "Oui, je la donne occasionnellement à l’église", "Non, je ne crois pas en la dîme", "Ça dépend"]} direction={"column"} currentValue={questionnaireData.answers.qS12} onSelect={(value) => updateAnswer("qS12", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<View className={'flex flex-row mb-4'}>
						<View className={'bg-gray-100 rounded-lg py-1 px-2'}>
							<CustomSemiBoldPoppingText value="Question facultative" color={null} fontSize={TEXT_SIZE.small} />
						</View>
					</View>
					<CustomRegularPoppingText value="Quelle sera la place de la vie spirituelle du couple dans ton mariage (prier ensemble, méditer ensemble, servir ensemble…) ?" color={'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Primordial, je ne m’imagine pas un seul instant avec un partenaire qui ne fait pas ces choses avec moi dans le mariage.", "Nécessaire, c’est l’idéal à atteindre mais dans les faits ce n’est pas possible. Je suis ouvert(e) aux concessions.", "Utile, le faire à deux c’est mieux mais le plus important c’est d’avoir ma liberté de le faire de mon côté.", "Au besoin, je n’imposerais jamais ma foi à l’autre."]} direction={"column"} currentValue={questionnaireData.answers.qS13} onSelect={(value) => updateAnswer("qS13", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3", marginVertical: 10 }}></View>

				{err !== "" ? <CustomRegularPoppingText style={{ alignSelf: 'center', marginTop: 10 }} fontSize={TEXT_SIZE.small} color={COLORS.red} value={err} /> : null}

				<View style={{ height: 50, paddingHorizontal: 20 }}>

					<TouchableOpacity onPress={() => handleSubmission()} style={{ borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20 }}>
						{isLoading ? <ActivityIndicator color="white" /> :
							<CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value="Suivant" />}
					</TouchableOpacity>
				</View>
				<View style={{ height: 20 }}></View>

			</ScrollView>

		</View>
	);
}









// export function Questionaire2({navigation}) {

//   const {questioniareLevel,err,setErr,registrationData,setQuestionaireLevel,setQuestionnaireProgress,questionnaireData,setQuestionnaireData} = useGlobalVariable()

//   useEffect(() => {
//     // Calculate initial progress when component mounts
//     const initialProgress = Object.values(questionnaireData.answered)
//       .filter(answered => answered).length;
    
//     setQuestionnaireProgress(initialProgress);
//   }, []);

//     useEffect(()=>{
//       setTimeout(()=>setErr(""),2000)
//     },[err])
  

//   const handleSubmission = async() => {
//     setIsLoading(true)
//     const data = {
//       ...registrationData,
//       ...questionnaireData?.answers,
//       qP13:JSON.stringify(questionnaireData?.answers.qP13),
//       qP15:JSON.stringify(questionnaireData?.answers.qP15),
//       qP16:JSON.stringify(questionnaireData?.answers.qP16),
//       qS10:JSON.stringify(questionnaireData?.answers.qS10),
//     }
//    await axios.post("/api/register/en",data).then((res) => {
//       console.log(res.data,"resdata")
//       if(res.data.errors) {
//         setErr(`address: ${res.data.errors?.address}` || `city: ${res.data.errors?.city}`)
//       } else if(res.data.status === 401){
//         setErr(`email error : ${res.data.message}`)
//       } else {
        
//         navigation.navigate("BottomTabsHome")
//       }
//       setIsLoading(false)
//     }).catch((err)=> {
//       console.log(err,"opppp")
//       setErr(err)
//       setIsLoading(false)

//     })
//   }



//   const MultiSelectAnswer = ({
//     questionKey,
//     answers,
//     direction = 'column',
//     selectedValues = [],
//     maxSelections,
//     onSelect
//   }) => {
//     const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];
  
//     return (
//       <View style={{
//          marginTop:10,
//         flexDirection: direction,
//         flexWrap: direction === 'row' ? 'wrap' : undefined,
//         alignItems: direction === 'column' ? 'flex-start' : 'center'
//       }}>
//         {answers.map(answer => {
//           const isSelected = safeSelectedValues.includes(answer);
//           const isDisabled = maxSelections !== undefined && 
//                             safeSelectedValues.length >= maxSelections && 
//                             !isSelected;
  
                        
//           return (
//             <TouchableOpacity
//               key={answer}
//               onPress={() => {
//                    console.log(isSelected,isDisabled,safeSelectedValues,answer,selectedValues,questionKey)
//                   return !isDisabled && onSelect(questionKey, answer,maxSelections)
//               }}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginRight: 10,
//                 marginBottom: 10,
//                 opacity: isDisabled ? 0.5 : 1
//               }}
//               disabled={isDisabled}
//             >
//               <View style={{
//                 width: 20,
//                 height: 20,
//                 borderRadius: 10,
//                 borderWidth: 2,
//                 borderColor: COLORS.primary,
//                 backgroundColor: isSelected ? COLORS.primary : 'transparent',
//                 marginRight: 8,
//                 justifyContent: 'center',
//                 alignItems: 'center'
//               }}>
//                 {isSelected && (
//                   <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
//                 )}
//               </View>
//               <Text style={{ fontFamily: FAMILLY.regular, fontSize: TEXT_SIZE.small }}>
//                 {answer}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     );
//   };


//   const handleMultiSelect = (questionKey, value,limit) => {
//     setQuestionnaireData(prev => {
//       // Safely get current values and limit
//       const currentValues = Array.isArray(prev.answers[questionKey]) 
//         ? prev.answers[questionKey]  
//         : [];
//       const maxLimit = limit;
  
//       // Determine new values
//       let newValues;
//       if (currentValues.includes(value)) {
//         // Remove if already selected
//         newValues = currentValues.filter(v => v !== value);
//       } else {
//         // Add if under limit or no limit
//         if (maxLimit === undefined || currentValues.length < maxLimit) {
//           newValues = [...currentValues, value];
//         } else {
//           // At max limit - don't change
//           return prev;
//         }
//       }
  
//       // Calculate progress changes
//       const wasAnswered = currentValues.length > 0;
//       const isNowAnswered = newValues.length > 0;
//       const progressDelta = !wasAnswered && isNowAnswered 
//         ? 1 
//         : wasAnswered && !isNowAnswered 
//           ? -1 
//           : 0;
  
//       if (progressDelta !== 0) {
//         setQuestionnaireProgress(prevProgress => prevProgress + progressDelta);
//       }
 
//       return {
        
//         answers: {
//           ...prev.answers,
//           [questionKey]: newValues
//         },
//         answered: {
//           ...prev.answered,
//           [questionKey]: isNowAnswered
//         }
//       };
//     });
//   };

  

   

    
//      const [country,setCountry] = useState({
//               flag:getEmojiFlag('CM'),
//                 name:"Cameroon",
//                 dial_code:"+237"
//      })

//      const [isLoading,setIsLoading] = useState(false)
//      const [date, setDate] = useState(new Date());
//      const [show, setShow] = useState(false);
//      const [visible,setVisible] = useState(false)
//      const [questionaireLevelLocal,setQuestionaireLevelLocal] = useState('1/2 Questions générales')
//      const hobies = ["Voyages","Sports","Dances","Cinéma","Musées","Conférences","Politique","Camping","Nourritures","Science","Bouquins","Musique"]


//      const updateAnswer = (questionKey, value) => {
//       setQuestionnaireData(prev => {
//         const wasAnswered = prev.answered[questionKey];
//         const isNowAnswered = value !== "" && value !== null && 
//                              (!Array.isArray(value) || value.length > 0);
    
//         // Only update progress if answer state changed from unanswered to answered
//         if (!wasAnswered && isNowAnswered) {
//           setQuestionnaireProgress(prevProgress => prevProgress + 1);
//         } 
//         // If answer changed from answered to unanswered, decrement progress
//         else if (wasAnswered && !isNowAnswered) {
//           setQuestionnaireProgress(prevProgress => prevProgress - 1);
//         }
    
//         return {
//           answers: {
//             ...prev.answers,
//             [questionKey]: value
//           },
//           answered: {
//             ...prev.answered,
//             [questionKey]: isNowAnswered
//           }
//         };
//       });
//     };
     
//      const CustomQuestionDisplayer = ({answers,direction,onSelect,currentValue}) => {
//       let firstStyles = {}
//       if(direction == "column"){
//            firstStyles = {flexDirection:direction,alignItems:"flex-start",justifyContent:"center"}
//       } else {
//            firstStyles = {flexDirection:direction,alignItems:"center",justifyContent:"space-between"}
//       }
//       return (<View>
//       <View style={{...firstStyles,marginTop:10}}>
//            {answers.map((an)=> {
//                 return (<View key={`${an}`} style={{marginBottom:direction=="column"?10:0,flexDirection:"row",alignItems:"center",justifyContent:"flex-start"}}>
//                      <TouchableOpacity onPress={async() => {
//                           onSelect(an)
                          
                     
//                      }} style={{alignItems:"center",justifyContent:"center",marginRight:10,padding:1,borderColor:COLORS.primary,borderWidth:2,borderRadius:50}}><View style={{height:13,width:13,backgroundColor: currentValue == an ? COLORS.primary:"white",borderRadius:50}}></View></TouchableOpacity>
//                      <Text style={{fontFamily:FAMILLY.regular,fontSize:TEXT_SIZE.small,marginTop:2,paddingRight:20}}>{an}</Text>
//                 </View>)
//            })}
//       </View>
//       </View>)
//  }



  
 

      
//      return (<View>
       
//        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:"white"}}>
// <View style={{height:50}}></View>

// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="En quelques mots, comment décrirais-tu ta relation avec Dieu (Ce que Jésus représente pour toi, le type d’église que tu fréquentes…) ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomRegularPoppingText value="C’est l’une des premières choses que les gens liront sur ton profil. Tu auras l’occasion d’en dire plus par la suite" color={null} fontSize={TEXT_SIZE.small} />

// <Pressable style={{paddingVertical:0,marginVertical:0,borderRadius:10,paddingHorizontal:15,backgroundColor:"rgba(181, 181, 181, 0.12)"}}>
// <CustomTextInput rightIconAction={null} name="height" placeHolder="Ex: Gagner les âmes, mon combat" LeftIcon={null} LeftIconStyles={null} RightIcon={null} RightIconStyles={null} directState={true} setState={(text) => updateAnswer("qS1",text)} state={questionnaireData.answers.qS1} />
// </Pressable>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Depuis combien de temps estimes tu que tu marches pleinement, de tout ton cœur avec le Seigneur ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Moins d’un an","1 à 2 ans","2 à 5 ans","5 à 10 ans","10 à 20 ans","Plus de 20 ans"]} direction={"column"} currentValue={questionnaireData.answers.qS2} onSelect={(value) => updateAnswer("qS2", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>

// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Quelle est ta dénomination religieuse ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Catholique","Calviniste","Évangélique","Charismatique","Méthodiste","Chrétien non pratiquant","Non croyant"]} direction={"column"} currentValue={questionnaireData.answers.qS3} onSelect={(value) => updateAnswer("qS3", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>



// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Es-tu ouvert(e) à rencontrer un partenaire qui a une dénomination religieuse différente de la tienne ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["oui","non","ça dépend"]} direction={"row"} currentValue={questionnaireData.answers.qS4} onSelect={(value) => updateAnswer("qS4", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Es-tu baptisé(e) d’eau ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Oui, par immersion","Oui, par aspersion mais sans confirmation","Oui, par aspersion et avec confirmation","non"]} direction={"column"} currentValue={questionnaireData.answers.qS5} onSelect={(value) => updateAnswer("qS5", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Es-tu baptisé(e) du Saint Esprit ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Oui et je parle en langues","Oui, mais je ne parle pas en langues","Je ne crois pas au baptême du Saint Esprit","Je ne sais pas ce que cela veut dire","non"]} direction={"column"} currentValue={questionnaireData.answers.qS6} onSelect={(value) => updateAnswer("qS6", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Es-tu un membre régulier d’une église locale, paroisse ou communauté ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Oui","Non"]} direction={"row"} currentValue={questionnaireData.answers.qS7} onSelect={(value) => updateAnswer("qS7", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Combien de fois par mois assistes tu généralement à un programme (culte, messe, ateliers, prières…) de l’église :" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Rarement : 1 fois","Occasionnel : 2 fois","Régulier : Plus de 4 fois","Je ne vais pas aux programmes de l’église","Ça dépend"]} direction={"column"} currentValue={questionnaireData.answers.qS8} onSelect={(value) => updateAnswer("qS8", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value=" Si tu as répondu non à la question précédente, peux-tu donner la raison ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Je recherche une église ","Je préfère vivre ma foi à la maison","Je fréquente plusieurs assemblées chrétiennes","Autre"]} direction={"column"} currentValue={questionnaireData.answers.qS9} onSelect={(value) => updateAnswer("qS9", value)}/>
// <Pressable style={{paddingVertical:0,marginVertical:0,borderRadius:10,paddingHorizontal:15,backgroundColor:"rgba(181, 181, 181, 0.12)"}}>
// <CustomTextInput rightIconAction={null} name="height" placeHolder="Ta réponse ici" LeftIcon={null} LeftIconStyles={null} RightIcon={null} RightIconStyles={null} directState={true} setState={(text) => updateAnswer("qS9",text)} state={questionnaireData.answers.qS9}/>
// </Pressable>
// </View>


// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>

 

// <View style={{marginVertical: 20, paddingHorizontal: 20}}>
//   <CustomRegularPoppingText 
//     value="Comment aimes-tu servir au sein de l’église locale ? (trois choix maximum)" 
//     color={'black'} 
//     fontSize={TEXT_SIZE.primary}
//   />
//   <MultiSelectAnswer
//     questionKey="qS10"
//     answers={["Administration","Addiction","Art.","Communication et Médias","Sonorisation","Éclairage","Bébés et enfants"]}
//     direction="column"
//     selectedValues={questionnaireData.answers.qS10}
//     maxSelections={3}
//     onSelect={handleMultiSelect}
//   />
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>



// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Crois-tu en l’abstinence sexuelle avant le mariage ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Oui, et je compte fermement la respecter","Non, j’ai mon avis sur ce sujet et je préfère en parler en privé avec la personne concernée","Ça dépend"]} direction={"column"} currentValue={questionnaireData.answers.qS11} onSelect={(value) => updateAnswer("qS11", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Crois-tu au principe de la dîme (10% des revenus) qui est donnée à l’église ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Oui, je la donne systématiquement à l’église","Oui, je la donne occasionnellement à l’église","Non, je ne crois pas en la dîme","Ça dépend"]} direction={"column"} currentValue={questionnaireData.answers.qS12} onSelect={(value) => updateAnswer("qS12", value)}/>
// </View>

// <View style={{height:1,backgroundColor:"#F3F3F3"}}></View>


// <View style={{marginVertical:20,paddingHorizontal:20}}>
// <CustomRegularPoppingText value="Quelle sera la place de la vie spirituelle du couple dans ton mariage (prier ensemble, méditer ensemble, servir ensemble…) ?" color={'black'} fontSize={TEXT_SIZE.primary}/>          
// <CustomQuestionDisplayer answers={["Primordial, je ne m’imagine pas un seul instant avec un partenaire qui ne fait pas ces choses avec moi dans le mariage.","Nécessaire, c’est l’idéal à atteindre mais dans les faits ce n’est pas possible. Je suis ouvert(e) aux concessions.","Utile, le faire à deux c’est mieux mais le plus important c’est d’avoir ma liberté de le faire de mon côté.","Au besoin, je n’imposerais jamais ma foi à l’autre."]} direction={"column"} currentValue={questionnaireData.answers.qS13} onSelect={(value) => updateAnswer("qS13", value)}/>
// </View>


// <View style={{height:1,backgroundColor:"#F3F3F3",marginVertical:10}}></View>






























// {err!==""? <CustomRegularPoppingText style={{alignSelf:'center',marginTop:10}} fontSize={TEXT_SIZE.small} color={COLORS.red} value={err}/>:null}
  
// <View style={{height:50,paddingHorizontal:20}}>
 
//      <TouchableOpacity onPress={() => handleSubmission()} style={{borderRadius:10,alignItems:'center',justifyContent:"center",backgroundColor:COLORS.primary,paddingVertical:10,paddingHorizontal:20}}>
//          {isLoading ? <ActivityIndicator color="white"/>:
//           <CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value="Suivant"/> }
//      </TouchableOpacity>
// </View>
// <View style={{height:20}}></View>













// </ScrollView>


     
//      </View>)
// }


 
