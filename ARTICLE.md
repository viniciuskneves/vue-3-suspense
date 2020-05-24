# Suspense: feeling of excited about what may happen

Well, the title came from Google but I think you can guess what I'm going to talk about =]

Vue 3 is coming with a some exciting new features. Composition API is the hottest one at the moment but there are others that excite me as much as it.

One of those new features is called `Suspense` and it really excites me about the benefits it brings. You might have heard about it already but I will try to show some examples of usage of `Suspense` and where it can be beneficial.

## What is Suspense?

> Suspense is a state of mental uncertainty, anxiety, of being undecided, or of being doubtful. In a dramatic work, suspense is the anticipation of the outcome of a plot or of the solution to an uncertainty, puzzle, or mystery, particularly as it affects a character for whom one has sympathy. - [Wikipedia](https://en.wikipedia.org/wiki/Suspense)

Back to Vue, `Suspense` is a component, that you don't need to import or do any kind of setup, with two `<slot>` that allows you to render a `#fallback` while the main component you want to load is not ready.

Ok, it seems vague. I will try to give you an example of how it is used. I also recommend you to take a look into its test cases, especially the [first one](https://github.com/vuejs/vue-next/blob/8b85aaeea9b2ed343e2ae19958abbd9e5d223a77/packages/runtime-core/__tests__/components/Suspense.spec.ts#L45-L69) to get familiar with it.

```html
<Suspense>
  <template #default>
    <!-- Here the component I want to render -->
  </template>
  <template #fallback>
    <!-- Here a fallback component to be shown while my component is not ready -->
  </template>
</Suspense>
```

That is the basic blueprint of it and it tackles a really common use case: the `v-if` loading condition.

I consider it the first benefit of `Suspense`, as now we've some standard way of dealing with this scenario. Before `Suspense` each developer could choose the way they want to implement it, they still can, and it was kind of a nightmare in situations where multiple components were loaded, so you would have `loadingHeader`, `loadingFooter`, `loadingMain`, and so on.

At the beginning I wrote "while the main component you want to load is not ready", what it means is that the main component has some kind of async work, which plays nicely with an `async setup()` from the new Composition API.

Let's say we have the following component with some async work to be done in `setup`:

```html
<template>
  <h1>I've some async work to do before I can render</h1>
</template>

<script>
export default {
  name: 'MyAsyncComponent',
  async setup() {
    await someAsyncWork();
  }
 }
 </script>
 ```
 
 Now we want to use this component somewhere but we want to have a proper loading while it is not ready.
 
 `Suspense` makes it more intuitive how it works and it really helps readability, check it:
 
 ```html
 <template>
  <Suspense>
    <template #default>
      <MyAsyncComponent />
    </template>
    <template #fallback>
      <span>Loading... Please wait.</span>
    </template>
  </Suspense>
</template>

<script>
import MyAsyncComponent from '@/components/MyAsyncComponent.vue';

export default {
  name: 'App',
  components: { MyAsyncComponent }
}
</script>
```

Another cool thing about it is that you can have multiple `Suspense` components defined and have different fallbacks for each of them.

## How do I handle errors?

Imagine the following: the call to `someAsyncWork` threw an exception. How do we handle it with `Suspense`?

We can use the `errorCapture` hook to listen to errors and conditionally render our `Suspense`. The component will look like the following:

```html
<template>
  // Here we conditionally render based on error
  <h1 v-if="error">I failed to load</h1>
  <Suspense v-else>
    <template #default>
      <MyAsyncComponent />
    </template>
    <template #fallback>
      <span>Loading... Please wait.</span>
    </template>
  </Suspense>
</template>

<script>
import { ref, onErrorCaptured } from 'vue'
import MyAsyncComponent from '@/components/MyAsyncComponent.vue';

export default {
  name: 'App',
  components: { MyAsyncComponent },
  setup() {
    const error = ref(null);

    onErrorCaptured((e) => {
      error.value = e

      return true;
    });
    
    return { error };
  }
}
</script>
```

To be honest it is quite a boilerplate if you're doing it in multiple places and can be a bit cumbersome if you've multiple `Suspenses`.

I do encourage you to wrap this logic, and even improve it to your use case, in a new component. The following example shows a simple wrapper on top of it:

```html
<template>
  <slot v-if="error" name="error"></slot>
  <Suspense v-else>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #fallback>
      <slot name="fallback"></slot>
    </template>
  </Suspense>
</template>

<script>
import { ref, onErrorCaptured } from 'vue'

export default {
  name: 'SuspenseWithError',
  setup() {
    const error = ref(null);

    onErrorCaptured((e) => {
      error.value = e

      return true;
    });
    
    return { error };
  }
}
</script>
```

So you can use it like this:

```html
<template>
  <SuspenseWithError>
    <template #default>
      <MyAsyncComponent />
    </template>
    <template #fallback>
      <span>Loading... Please wait.</span>
    </template>
    <template #error>
      <h1>I failed to load</h1>
    </template>
  </Suspense>
</template>

<script>
import MyAsyncComponent from '@/components/MyAsyncComponent.vue';
import SuspenseWithError from '@/components/SuspenseWithError.vue';

export default {
  name: 'App',
  components: { MyAsyncComponent, SuspenseWithError },
}
</script>
```

Bear in mind that it is a simple and compact implementation that has not been tested in a real application. It also does not distinguished errors which might not be the ideal scenario for you.

## Suspense with Vue Router

The main goal of this Dose is to show how to use the `Suspense` with Vue Router. All the other examples above were made to introduce `Suspense` and its power.

`Suspense` plays nicely with Vue Router. What I mean is that you can `Suspense` your `<router-view>` and in case the view has an async setup, you can show a fallback.

To be more specific: You can create your loading component that will be shown whenever your view is not ready due some async work that has to be performed.

You can achieve the same behavior with the navigation guards but for most of the cases, which do not involve a complex setup, the combination `<router-view>`, `Suspense` and async setup do a nice job!

The example below shows how it can be implemented:

```html
<Suspense>
  <template #default>
    <router-view />
  </template>
  <template #fallback>
    <span>I'm a loading screen, I'm waiting the view to be ready!</span>
  </template>
</Suspense>
```

## All in all

- `Suspense` can be used to show a fallback element when an async work is needed in the main component
- One component can have multiple suspended components inside
- Error handling can be done with `onErrorCaptured` hook
- A wrapper can be created to extract the error logic
- `Suspense` plays nicely with Vue Router once we want to show a loading screen

The final result is shown below and you can also check the sample code here: [vue-3-suspense](https://github.com/viniciuskneves/vue-3-suspense).

![Final example](https://i.ibb.co/qxPjWk0/vue-dose.gif)
