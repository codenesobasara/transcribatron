# Transcribatron - Privacy Policy

**Effective date:** August 18, 2026

This Privacy Policy explains how the Transcribatron app for iOS and macOS ("the
App"), published by Marc Maguire ("we", "us"), handles your information.

"The App" includes everything we ship with it: the iPhone, iPad, and Mac apps,
the Transcribatron keyboard, the Share extensions, and the assistant connector on
your Mac. Where one of them behaves differently, this policy says so.

## The short version

Transcribatron is **local-first**. Your recordings are transcribed **on your
device**. We do **not** have accounts, we do **not** run a server that collects
your content, we do **not** use analytics or advertising trackers, and we do
**not** sell your data. Two things happen without you switching them on: **App Store purchase
validation**, which runs whenever you open the App and never involves your
content, and **syncing to your own private iCloud**, which follows your device's
iCloud setting rather than a switch inside the App. Everything else leaves your
device only through features you turn on. This policy explains exactly what, and
to whom.

## Information that stays on your device

- **Audio recordings** never leave your device through the App. Recording and
  playback are local.
- **Transcription** runs entirely on-device (using on-device speech models). No
  audio is uploaded for transcription.
- **System audio capture and the Screen Recording permission (macOS,
  optional).** To record an online meeting, the App can capture the audio your
  Mac is playing - the other people on the call - and mix it with your
  microphone so both sides of the conversation are transcribed. macOS provides
  no audio-only capture interface: the only way to record system audio is
  through ScreenCaptureKit, which is governed by the **Screen Recording**
  permission and requires a video stream to be configured even when only audio
  is wanted. **The App does not record your screen.** It requests the minimum
  video configuration the interface allows and discards every video frame
  without reading it; no screenshot, image, video, or window content is
  captured, examined, stored, or transmitted, and none is written to disk. The
  only data kept is the audio, which is mixed with your microphone into the
  recording for that meeting and stored on your device exactly like any other
  recording. This is off by default and is used only while you are recording a
  meeting with system-audio capture switched on.
- **Your AI provider API keys** are stored in the device Keychain. They are not
  transmitted to us. This includes any key you add for a cloud voice
  (text-to-speech) provider.
- **Your calendar** (optional). If you grant calendar access, the App reads your
  upcoming events **on your device** to show you meetings you may want to
  record, remind you before they start, and - when you choose - add a link back
  to your recording on the event. Your calendar is read **on your device** and is
  never uploaded to us. One caveat: when you link a recording to an event, the
  event's title, agenda, and attendee list are saved *with that meeting* - so if
  iCloud sync is on, they sync to your own private iCloud along with the rest of
  the meeting (see "Sync to your own iCloud" below). Nothing goes to us either
  way.
- **Document scans** (optional). If you use the camera to scan a document so it
  can be read aloud, the scan is converted to text **on your device**. The
  images are not uploaded.

## The Transcribatron keyboard and "Full Access" (iOS)

The Transcribatron keyboard is optional and off until you add it yourself in iOS
Settings. When you do, iOS asks you to grant it **Full Access** and shows a
strong warning - because a keyboard with Full Access *could*, in principle,
transmit what you type. That warning is Apple's, it applies to every third-party
keyboard, and it is worth taking seriously. So here is what ours actually uses it
for.

Full Access is what lets the keyboard reach the App's own data and settings on
your device - the two share a private App Group container - so that dictation and
AI cleanup work in the keyboard the same way they work in the App. If you have
chosen a cloud AI provider, cleaning up your dictated text sends that text under
**your own API key**, exactly as described in "Cloud AI processing" below. If you
haven't, nothing is sent.

**The keyboard never transmits what you type on its own, and it does not log or
store it.** It contains no analytics, and we run no server for it to report to.

Two buttons can send text off the device, both only when you press them and both
only if you have chosen a cloud AI provider: cleaning up what you just dictated,
and the wand - which takes the text already sitting in the field you are editing,
including text you typed yourself before opening the keyboard, and runs it
through that same cleanup.

If you would rather not grant Full Access, don't - dictation and AI cleanup in
the keyboard will be unavailable, and nothing else about the App changes.

## Information that leaves your device

Everything in this section happens only when you turn the feature on, with two
exceptions. **Purchase validation** (item 5) runs automatically so the App knows
what you've bought. **iCloud sync** (item 2) is active whenever your device is
signed in to iCloud, unless you disable it for the App in your device's iCloud
settings - there is no separate switch for it inside the App. The App also
downloads AI model files the first time it needs them (item 4); that is a
download, not an upload of anything of yours.

### 1. Cloud AI processing - under your own key

If you choose a cloud provider for features such as cleanup, summaries, chat, or
**reading your content aloud** (text-to-speech), the App sends the relevant
**transcript or document text** (never the audio you recorded) directly from your
device to the provider **you selected**, using **your own API key and account**.
Supported providers include Anthropic, OpenAI, Google, and xAI; for cloud voices,
OpenAI, Google, and ElevenLabs. On-device voices are also available, and using
one sends nothing.

The audio is never sent. Several other things are, and you should know what
they are:

- **The style instruction** you chose, including any custom style you wrote.
- **Your custom vocabulary** - the terms, the "sounds like" phrases, and any
  hints you added - travels with cleanup, analysis, and chat requests so the
  model spells your terms correctly. If you use a cloud provider, your
  vocabulary list goes with them.
- **Your questions**, when you chat with a transcript.
- **Calendar details of a linked meeting** - the event title, the agenda, and
  attendee names - when you run AI analysis on a meeting you linked to a
  calendar event. Those attendee names are other people's.

That data is handled under **the provider's own privacy policy and terms**, not
ours - we do not receive, store, or proxy it. Most providers' API tiers do not
use data submitted through the API to train their models by default, but this is
governed by your provider's terms - review them. If you prefer to keep everything
local, you can use an on-device AI model instead, and nothing is sent.

### 2. Sync to your own iCloud (optional)

If iCloud is enabled, your transcripts and related data sync through **Apple's
CloudKit to your own private iCloud database**. This is your Apple account and
Apple's infrastructure - **the data does not go to a Transcribatron server**.
Apple's handling of iCloud data is governed by Apple's privacy policy. You can
manage or disable this in your device's iCloud settings.

### 3. Diagnostic logging (off by default, opt-in)

This is **off by default** and exists for one purpose: so that if you hit a bug,
you can help us reproduce it. Nothing is sent unless you switch it on yourself.

When you do, the App sends its **diagnostic log** - a record of in-app actions
(e.g. "started recording", "opened settings"), app and error events, screen
identifiers, and limited technical metadata. It **never includes your
transcripts, audio, or other content**. Only an approved list of technical
fields is allowed to leave the device; anything not on that list is dropped
before sending.

The switch **turns itself back off automatically after about one hour**, so you
cannot leave it running by accident, and there is a cap on how much can be sent
in any 24-hour period. You can also turn it off yourself at any moment.

The logs are received by **Grafana Cloud**, a hosted logging service operated by
Grafana Labs, which acts as our processor for this and handles the data under
its own terms. Along with purchase validation (item 5), this is one of only two
flows in this policy that reach a service running under *our* account rather
than yours - which is precisely why it is opt-in, content-free, and
self-expiring.

### 4. AI model downloads

The App downloads on-device AI model files from **Hugging Face**, a public
model host. (Some are fetched by the FluidAudio library, but they come from
Hugging Face too - it is a piece of software we use, not a separate host.)
These are **downloads of model software, not uploads of your content** - no personal information is sent in the process
beyond what a normal file download requires (e.g. your IP address, as with any
internet request).

### 5. Purchase validation (RevenueCat) - always on

The App is free to try and then offers a **one-time lifetime purchase** through
Apple's App Store. To check what you've bought and unlock it across your
devices, the App uses **RevenueCat**, a purchase-infrastructure service. This is
the one flow you do not switch on: it runs when you open the App.

RevenueCat receives a **randomly generated anonymous ID**, your **App Store
purchase and entitlement information**, and basic technical details (such as
device model and OS version, and - as with any internet request - your IP
address). It is used solely to determine what you have purchased.

On iPhone and iPad the request also carries the **identifier Apple gives
developers for your device** (the "IDFV"). It is the same for every app we
publish on that device and resets when you delete them all. We do not ask for
it, use it, link it to you, or keep it against any record - RevenueCat's
software attaches it to each request it makes. On a Mac, nothing of the kind
is sent.

RevenueCat does **not** receive your recordings, transcripts, notes, name,
email, or Apple ID. Unlike the AI providers above, this runs under **our**
RevenueCat account rather than one of yours, but it is not linked to your
identity by us, and there is no sign-in. RevenueCat's handling is governed by
their own privacy policy.

### 6. AI-assistant connections on your Mac (optional, off by default)

On macOS you can let AI assistant apps running **on your own computer** read your
meetings and dictations, using the Model Context Protocol ("MCP") - for example,
to ask an assistant about a past meeting. This is **off by default**, and full
transcript text sits behind its own separate switch even after you turn the
connection on.

A separate switch, also off by default, lets an assistant **do** things rather
than only read: transcribe a file you point it at, clean up text, or run an
analysis. Those actions use whatever AI provider you have configured, so turning
them on means an assistant can cause text to be sent to your cloud provider
under your own key without you initiating it in the App each time.

That same switch also covers voice: an assistant can play your recordings aloud,
speak text, and **ask you a question out loud - recording your spoken answer,
transcribing it on your device, and returning the text to the assistant.** The
recording is made only when the assistant asks and you answer, and the audio does
not leave your Mac, but an assistant being able to start a recording at all is
the reason this switch is off until you turn it on.

Anything you allow an assistant app to read is then handled under **that app's**
privacy policy, including any cloud AI service it sends it to. You can turn this
off at any time in the App's settings.

## What we do NOT do

- No user accounts with us.
- No advertising, no ad identifiers (IDFA), no cross-app/website tracking.
- No third-party analytics SDKs (no Firebase, Sentry, Mixpanel, etc.). Our
  purchase-validation provider (RevenueCat, above) receives purchase data, not
  analytics or behavioural tracking.
- No selling or renting of your data.
- **No screen recording.** The Screen Recording permission is used solely to
  capture system audio during a meeting you are recording (see above). No screen
  content is ever captured, stored, shared, or transmitted.
- **No training on your content - we could not if we wanted to.** Your
  recordings and transcripts never reach us, so there is nothing for us to train
  a model on. There is no setting to opt out of, because there is nothing to opt
  out of.

If any of these commitments ever had to change, we would say so in the App
before the change took effect.

## Sending your notes somewhere else

Some features write your content to a place you chose:

- **Obsidian.** If you connect a vault, the App writes each analysis into that
  vault folder as a markdown file, automatically, as it is produced. Where the
  vault then goes is up to you - many are synced by iCloud Drive, Obsidian Sync,
  or Dropbox, and that is outside the App.
- **Exports and sharing.** Anything you copy, share, export as subtitles, or send
  to Apple Notes goes wherever you send it, under that service's terms.

We are not in the middle of any of these. We cannot see what you export, and we
cannot retrieve or delete it afterwards.

## Other people in your recordings

Your recordings will usually contain other people's voices and personal
information. On a Mac, if you turn on system-audio capture, a recording also
takes in the audio your computer is playing - which on a call means everyone
else on it, not only what your microphone hears. Because that data lives only on your device and under your control,
**you - not we - are the one handling it.** You are responsible for recording
lawfully (see the [Terms of Use](https://transcribatron.ca/terms)), for how you share
transcripts, and for honouring a participant's request to delete a recording of
them. We cannot do any of those things for you, because we hold no copy.

If you use the App for work, your employer's or client's privacy obligations may
also apply to what you record.

## App Store privacy declarations

Consistent with the above, the App's privacy manifest declares that any
collected data is **not used for tracking**. It covers *Other User Content*,
*Other Diagnostic Data*, and *Purchase History* - each used solely for **app
functionality** and none of it linked to your identity by us.

## Data retention and deletion

- Content you create lives on your device (and your own iCloud, if enabled).
  Deleting items in the App, or deleting the App, removes local copies; iCloud
  copies are controlled through your Apple account.
- Local diagnostic logs are kept briefly on-device (about seven days) and then
  removed.
- Diagnostic logs you chose to send us are retained by our logging provider for
  **14 days** and then deleted automatically. They contain no transcripts,
  audio, or other content.
- Purchase and entitlement data held by our purchase-validation provider is
  retained under their policy for as long as we use the service.
- Data you sent to a third-party AI provider is subject to **that provider's**
  retention practices; consult their policy and account controls.

Because we hold no copy of your content, **we cannot recover anything for you.**
Deleting the App deletes its content from that device. Keep your own backups.

Two small records live in the system Keychain and can survive deleting and
reinstalling the App: any API keys you saved, and a note that a free trial was
already started on this device. That second one holds a date and nothing else -
it is how the trial resists being reset by reinstalling.

## Your recording responsibilities

Recording laws vary by location and may require the consent of everyone being
recorded. You are responsible for complying with applicable laws when you record
people, calls, or meetings. See the [Terms of Use](https://transcribatron.ca/terms).

## Children

The App is not directed to children. You must be at least 13 years old, or the
higher minimum age required where you live, to use it. We do not knowingly
collect personal information from children.

**Cloud AI features are 18+.** On-device recording, transcription, on-device AI
models, and on-device voices are available at the age above. Connecting a cloud
AI provider is not:
some providers (currently including Google and ElevenLabs) require you to be 18,
and Google's terms bar use of its API in an app likely to be accessed by people
under 18. That requirement runs between you and the provider whose key you
supply - see the [Terms of Use](https://transcribatron.ca/terms) section 3.

## Your rights

Because we do not collect your content on our own servers, most data-subject
requests (access, deletion, portability) are satisfied directly on your device
and through your own iCloud and AI-provider accounts. For questions, contact us
below. Where you have rights under laws such as the GDPR, CCPA/CPRA, PIPEDA, or
Quebec's Law 25, we will honor applicable requests we are able to fulfill.

To be concrete about what we can and cannot do: for your **content** there is
nothing for us to disclose, correct, or delete, because we never receive it.
Requests about **purchase data** should come to us and we will pass them to our
purchase-validation provider. Requests about data in **your iCloud** are handled
by Apple through your Apple account.

**Withdrawing consent.** Every optional flow in this policy can be switched off
in the App's settings at any time: cloud AI, diagnostics, the assistant
connector, calendar access, and Obsidian. Turning one off stops it going
forward. iCloud sync is controlled in your device's iCloud settings, not ours.

**Automated decisions.** We make no automated decisions about you that produce
legal or similarly significant effects. The AI features process text you give
them; they do not evaluate, score, or profile you.

**Complaints.** If you think we have handled your information badly, tell us
first - but you can also complain to a regulator. In Canada that is the Office
of the Privacy Commissioner, or the Commission d'accès à l'information for
Quebec. In the UK, the Information Commissioner's Office. In the EU/EEA, your
national data protection authority.

## Where your information goes

We hold nothing on our own servers, but two services running under our accounts
are in the United States: our purchase-validation provider and, if you switch
diagnostics on, our logging provider. What reaches them is described in items 3
and 5 above - no recordings, no transcripts, no notes.

Anything you send to a cloud AI provider goes wherever that provider operates,
under your account with them.

## Person responsible for privacy

Marc Maguire is the person responsible for the protection of personal
information in connection with the App, including for the purposes of Quebec's
Law 25. You can reach him at marc@transcribatron.ca.

## Third parties referenced in this policy

| Party | What they may receive | Under whose account |
|-------|-----------------------|---------------------|
| AI / voice provider you choose (Anthropic / OpenAI / Google / xAI / ElevenLabs) | Transcript or document text, your chat questions, style instruction, custom vocabulary, and - for calendar-linked meetings - event details. **Never audio.** | **Your** API key/account |
| Apple iCloud | Your synced app data | **Your** iCloud account |
| Apple (App Store) | Your purchase | **Your** Apple account |
| RevenueCat (purchase validation) | Anonymous ID, App Store purchase/entitlement data, device info - **no content** | **Our** account, no sign-in by you |
| Hugging Face (model downloads) | Standard download request metadata (e.g. IP) | None (public download) |
| Grafana Cloud (Grafana Labs) - diagnostic logging | Diagnostic logs: in-app actions, app/error events, technical metadata - **no content** | **Our** account; opt-in, auto-off after ~1 hour |
| AI assistant apps on your Mac (MCP) | Whatever you expose - meetings, and transcripts only if you enable that | Off by default; that app's own policy |

## Changes to this policy

We may update this policy. Material changes will be reflected by an updated
effective date and, where appropriate, an in-app notice.

## Contact

Questions about privacy, and requests under the rights described above:
support@transcribatron.ca.
