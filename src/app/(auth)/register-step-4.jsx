import { COLORS, FAMILLY, TEXT_SIZE } from "../../utils/constants";
import React, { useEffect, useState } from "react"
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, Pressable } from "react-native"
// import { Pressable, ScrollView } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { RedTick, TextInputArrowDownCircle, TextInputDate } from "../../components/vectors";
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../components/text";
import dayjs from 'dayjs'
import CustomTextInput from "../../components/textInput";
import { useGlobalVariable } from "../../context/global";
import { QuestionaireHeader } from '../../components/questionaireHeader';
// import CountryPickerModal from "../src/components/modalPicker";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getEmojiFlag } from "countries-list";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import CustomQuestionDisplayer from "../../components/auth/CustomQuestionDisplayer";



export default function RegistrationStepFour({ navigation }) {

	const { questioniareLevel, err, setErr, registrationData, setQuestionaireLevel, setQuestionnaireProgress, questionnaireData, setQuestionnaireData } = useGlobalVariable()
	const [emailExists, setEmailExists] = useState(false);

	useEffect(() => {
		// Calculate initial progress when component mounts
		const initialProgress = Object.values(questionnaireData.answered)
			.filter(answered => answered).length;

		setQuestionnaireProgress(initialProgress);
	}, []);

	// useEffect(() => {
	// 	setTimeout(() => setErr(""), 2000)
	// }, [err])


	const handleSubmission = async () => {
		let token = await AsyncStorage.getItem("user_token")
		setIsLoading(true)
		const data = {
			...registrationData,
			...questionnaireData?.answers,
			qP13: JSON.stringify(questionnaireData?.answers.qP13),
			qP15: JSON.stringify(questionnaireData?.answers.qP15),
			qP16: JSON.stringify(questionnaireData?.answers.qP16),
			qS10: JSON.stringify(questionnaireData?.answers.qS10),
		}


		await axios.post("/api/register/en", data,
			{ headers: { "Authorization": `Bearer ${token}` } }
		).then((res) => {
			if (res.data.errors) {
				console.log(res.data.errors, "resdata")
				// setErr(`address: ${res.data.errors?.address}` || `city: ${res.data.errors?.city}`)
				setErr(res.data.errors)
				setIsLoading(false)
			} else if (res.data.status === 401) {
				console.log(`email error : ${res.data.message}`)
				setErr("")
				setEmailExists(true)
				setIsLoading(false)
			} else {
				navigation.navigate("AccountCreated")
			}
			setIsLoading(false)
		}).catch((err) => {
			console.log(err?.request, "opppp")
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

	return (
		<View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "white" }}>
				{/* Page header */}
				<Stack.Screen options={{
					header: ({ navigation }) => (
						<QuestionaireHeader navigation={navigation} title={"2/2 Votre foi"} description={"Parlez-nous de votre vie chrétiènne"} />
					)
				}} />
				{/* Page header */}

				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "white" }}></ScrollView>
				<View style={{ height: 30 }}></View>

				<View className={'gap-3'} style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="En quelques mots, comment décrirais-tu ta relation avec Dieu (Ce que Jésus représente pour toi, le type d’église que tu fréquentes…) ?" color={err.qS1 ? COLORS.red : 'black'} fontSize={TEXT_SIZE.primary} />
					<CustomRegularPoppingText value="C’est l’une des premières choses que les gens liront sur ton profil. Tu auras l’occasion d’en dire plus par la suite" color={null} fontSize={TEXT_SIZE.small} />

					<Pressable style={{ paddingVertical: 0, marginVertical: 0, borderRadius: 10, paddingHorizontal: 15, backgroundColor: "rgba(181, 181, 181, 0.12)" }}>
						<CustomTextInput rightIconAction={null} name="height" placeHolder="Ex: Gagner les âmes, mon combat" LeftIcon={null} LeftIconStyles={null} RightIcon={null} RightIconStyles={null} directState={true} setState={(text) => updateAnswer("qS1", text)} state={questionnaireData.answers.qS1} />
					</Pressable>
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Depuis combien de temps estimes tu que tu marches pleinement, de tout ton cœur avec le Seigneur ?" color={err.qS2 ? COLORS.red : 'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Moins d’un an", "1 à 2 ans", "2 à 5 ans", "5 à 10 ans", "10 à 20 ans", "Plus de 20 ans"]} direction={"column"} currentValue={questionnaireData.answers.qS2} onSelect={(value) => updateAnswer("qS2", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Quelle est ta dénomination religieuse ?" color={err.qS3 ? COLORS.red : 'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Catholique", "Calviniste", "Évangélique", "Baptiste", "Protestante", "Pentecôtiste", "Presbytérienne", "Charismatique", "Adventiste", "Méthodiste", "Chrétien non pratiquant", "Non croyant"]} direction={"column"} currentValue={questionnaireData.answers.qS3} onSelect={(value) => updateAnswer("qS3", value)} />
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
					<CustomRegularPoppingText value="Es-tu baptisé(e) d’eau ?" color={err.qS5 ? COLORS.red : 'black'} fontSize={TEXT_SIZE.primary} />
					<CustomQuestionDisplayer answers={["Oui, par immersion", "Oui, par aspersion mais sans confirmation", "Oui, par aspersion et avec confirmation", "non"]} direction={"column"} currentValue={questionnaireData.answers.qS5} onSelect={(value) => updateAnswer("qS5", value)} />
				</View>

				<View style={{ height: 1, backgroundColor: "#F3F3F3" }}></View>

				<View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
					<CustomRegularPoppingText value="Es-tu baptisé(e) du Saint Esprit ?" color={err.qS6 ? COLORS.red : 'black'} fontSize={TEXT_SIZE.primary} />
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
					questionnaireData.answers.qS7 === "Non" && (
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
						color={err.qS10 ? COLORS.red : 'black'}
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
					<CustomRegularPoppingText value="Crois-tu en l’abstinence sexuelle avant le mariage ?" color={err.qS11 ? COLORS.red : 'black'} fontSize={TEXT_SIZE.primary} />
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

				{err !== "" ? <CustomRegularPoppingText style={{ alignSelf: 'center', marginBottom: 5 }} fontSize={TEXT_SIZE.medium} color={COLORS.red} value={'Please, fill in all the mendory fields'} /> : null}
				{emailExists ? <CustomRegularPoppingText style={{ alignSelf: 'center', marginBottom: 5 }} fontSize={TEXT_SIZE.medium} color={COLORS.red} value={'A user with this email already exists'} /> : null}

				<View style={{ height: 50, paddingHorizontal: 20 }}>
					<TouchableOpacity onPress={() => handleSubmission()} style={{ borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20 }}>
						{isLoading ? <ActivityIndicator color="white" /> :
							<CustomRegularPoppingText color={"white"} fontSize={TEXT_SIZE.primary} value="Suivant" />}
					</TouchableOpacity>
				</View>
				<View style={{ height: 100 }}></View>

			</ScrollView>

		</View>
	);
}