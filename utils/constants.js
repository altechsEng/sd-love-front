export const COLORS = {
     primary: "#D7A898", //now you can use className="text-primary" etc etc
     lightRed:"#E55B6B",
     black:"#2E2E2E",
     gray:"#5E5E5E",
     red:"#E55E6F",
     light:"#F5F6FC",
     black:"#2E2E2E"
};

export const POST_LIMIT = 5
export const defaultProfiles = [  {
          key:"pro1",
          image:require("../assets/images/grid1.png"),
          name:"Henriette",
          age:26,
          location:"Chicago - 7km",
          latitude:37.79274,
          longitude:-122.4324
 
     },
     {
          key:"pro2",
          image:require("../assets/images/grid2.png"),
          name:"Gleine",
          age:27,
          location:"Chicago - 7km",
          latitude:37.78825,
          longitude:-122.4187
 
     },
     {
          key:"pro3",
          image:require("../assets/images/grid3.png"),
          name:"Stephanie",
          age:23,
          location:"Chicago - 7km",
          latitude:37.7658,
          longitude:-122.4324
 
     },
     {
          key:"pro4",
          image:require("../assets/images/grid4.png"),
          name:"Lora",
          age:24,
          location:"Chicago - 7km",
          latitude:37.78825,
          longitude:-122.4722
     },
     {
          key:"pro5",
          image:require("../assets/images/test_match1.jpg"),
          name:"Maggy",
          age:24,
          location:"Chicago - 7km" ,
          latitude:37.79274,
          longitude:-122.4324
 
     },
     {
          key:"pro6",
          image:require("../assets/images/grid5.png"),
          name:"Annie",
          age:24,
          location:"Chicago - 7km",
          latitude:37.79274,
          longitude:-122.4324
 
     }]
export const TEXT_SIZE = {
    title: 20,
    primary: 15,
    secondary: 13,
    small: 11,
};

export const FAMILLY = {
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    semibold:  "Poppins-SemiBold",
    light:  "Poppins-Light",
};


export const BaseImageUrl = `https://sdlove-api.altechs.africa/storage/app/private/public/user_images`
export const BasePostImageUrl = `https://sdlove-api.altechs.africa/storage/app/private/public/post_media`