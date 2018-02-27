# Time travel

Wouldn't it be great if we could have global stores and component-bound stores and still keep a single, global record of all state changes? Oh! We can.

{% include '/templates/attachChildExample.md' %}

[`<Context.Injector>`](/types/context/Injector.md) and [`<Context.Provider>`](/types/context/Provider.md) accept `onMount` and `onUnmount` properties that will be called when the component is mounted and unmounted. These hooks are designed specially for attaching/detaching child stores to/from parent stores.

Here we accessed the rootStore globally, but we can just as easily wrap `<CounterContext.Injector>` in a rootStore Provider/Consumer. On that note, we don't have to attach everything directly to the root. This is a hierarchy, after all! We could attach it to a store that attaches to a store that attaches to the root. Yeah, like, whoa.

While not too hard, this attach-to-parent-store process is pretty involved. React Zedux does not currently offer a higher-level way of doing this as any abstraction here would be pretty opinionated. But it isn't too hard to make your own!