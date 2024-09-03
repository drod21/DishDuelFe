As a user, I want the ability to see a restaurants rank.

- [x] Ranks should correspond to the following system - Unranked, Bronze, Silver, Gold, Platinum, Diamond, Quartz. Quartz should be the highest rank, and bronze the lowest. Come up with a system based on a restaurants MMR to divise this system.
- [x] Integrate with Supabase to pull a restaurants MMR. The table is called Restaurants. If the restaurant doesn't exist in Supabase yet, add it to the database.
- [x] Show the rank in RestaurantDetails.tsx with the text highlighted as color at the top of the component - this will eventually have an icon.
- [x] Add the ability to filter by rank in the FilterModal component.
