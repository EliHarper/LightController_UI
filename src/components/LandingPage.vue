<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/ipsum-logo.svg')"
          class="my-3"
          contain
          height="200"
          
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to this Bitchin Light Controller
        </h1>

        <p class="subheading font-weight-regular">
          Have fun messing around with our lights lol
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          What's next?
        </h2>
        <p class="subheading font-weight-regular">
          Click on this ambiguous icon to go do stuffs:
        </p>

        <v-row justify="center">
          <v-col cols="12">
            <v-img 
            :src="require('../assets/acme-dark.svg')"
            class="my-3"
            contain
            height="300"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'LandingPage',

    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
    }),
  }
</script>
