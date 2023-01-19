<PlaceSearch v-bind:ready="ready" placeholder="Enter a location" loading="Map is loading..."
  v-bind:fallbackProcedure="fallbackProcedure" v-bind:zoom="zoom" v-bind:geolocation="geolocation"
  v-bind:gps_timeout="3000" v-bind:address="address" @changed="getMapData">
  </PlaceSearch>
<script>
export default {
    name: "AdressesCreate",
    data() {
        return {
            ready: false,
            fallbackProcedure: "gps",
            zoom: 15,
            geolocation: {
                lat: 31.73858,
                lng: -35.98628,
                zoom: 2,
            },
            address: {
                query: "Albania, Tirane",
                zoom: 15,
            },
            manually: {
                address_description: "21 Dhjetori Street, Tirana, Albania",
                city: "Tirana",
                country: "Albania",
                lat: 41.3275,
                lng: 19.81889,
                state: "Tirane",
                zip_code: "1001",
                zoom: 15,
            },
            place: {},
        };
    },
    methods: {
        getMapData(place) {
            this.place = place;
        },
    },
    created() { },
}
</script>