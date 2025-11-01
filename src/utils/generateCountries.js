 
import fs from 'fs'
import {countries} from 'countries-list'
import allCities from 'all-the-cities'
 

export function getEmojiFlag(countryCode) {
  // Convert country code to regional indicator symbols
  const codePoints = countryCode.toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

async function generateCountriesJson() {
  try {
    // Popular countries list
 

    const countriesData = Object.entries(countries)
      .map(([code, country]) => ({
        code,
        name: country.name, // Already properly capitalized in countries-list
        dial_code: `+${country.phone}`,
        flag: getEmojiFlag(code)
      }))
       

    fs.writeFileSync('countries.json', JSON.stringify(countriesData, null, 2));
    console.log('✅ Successfully generated countries.json with flag emojis!');
   
  
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}



// 2. City Data Generation
 async function generateCities() {
     const citiesData = allCities.map(city => ({
       name: city.name,
       country_code: city.country,
       latitude: city.lat,
       longitude: city.lon,
       population: city.population
     }));
   
     fs.writeFileSync('cities.json', JSON.stringify(citiesData, null, 2));
     console.log(`✅ Generated cities.json with ${citiesData.length} cities`);
   }

 
   // 3. Main Execution
   (async () => {
     try {
       // First generate countries
       await generateCountriesJson();
       
       // Then generate cities  
       await generateCities()
      
        
       
       console.log('🎉 Both files generated successfully!');
     } catch (error) {
       console.error('⚠️ Script failed:', error.message);
     }
   })();