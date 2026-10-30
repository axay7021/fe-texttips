'use client';

import { useCompletion } from '@ai-sdk/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Feather,
  FileText,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { parseEnhancementResult } from '@/utils/text-enhancer';
import styles from './writing-desk.module.css';

const tones = [
  'Professional',
  'Friendly',
  'Concise',
  'Polished',
  'Clear',
  'Confident',
];
const examples = [
  {
    label: 'A better email',
    text: 'Hey, can you send the updated proposal before our meeting tomorrow?',
  },
  {
    label: 'A clearer update',
    text: 'We finished the design and now the team is working on building the new dashboard.',
  },
  {
    label: 'A kinder follow-up',
    text: 'Just checking if you had a chance to look at the document I sent last week.',
  },
];

export function WritingDesk({ ready }: { ready: boolean }) {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { complete, completion, isLoading, setCompletion, stop } =
    useCompletion({
      api: '/api/enhance',
      onError: () =>
        setError(
          ready
            ? 'We couldn’t finish this rewrite. Your draft is still here—please try again.'
            : 'Live rewriting is waiting for AI and database setup. You can still draft text and explore the editor.',
        ),
    });
  const versions = useMemo(
    () => parseEnhancementResult(completion),
    [completion],
  );
  const result = versions.find((version) => version.title === tone)?.text || '';
  function reset() {
    stop();
    setText('');
    setCompletion('');
    setError('');
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        'Copy is unavailable in this browser. Select and copy the result manually.',
      );
    }
  }
  return (
    <div className={styles.desk}>
      <a href='#writing-desk' className={styles.skip}>
        Skip to editor
      </a>
      <header className={styles.header}>
        <Link href='/' className={styles.brand}>
          <span>
            <Feather size={22} aria-hidden='true' />
          </span>
          texttips<span className={styles.brandDot}>.</span>
        </Link>
        <nav aria-label='Main navigation'>
          <a href='#writing-desk'>The editor</a>
          <a href='#possibilities'>Made for your words</a>
        </nav>
        <Link className={styles.signIn} href='/auth/sign-in'>
          Sign in <ArrowUpRight size={16} aria-hidden='true' />
        </Link>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>
            <span /> A LITTLE CLARITY GOES A LONG WAY
          </p>
          <h1>
            Your thoughts.
            <br />
            <em>Better expressed.</em>
          </h1>
          <p className={styles.description}>
            The right words are already in there. Give them a little room.
            <br />
            Turn your rough draft into something that sounds like you.
          </p>
          <a className={styles.heroLink} href='#writing-desk'>
            Let’s find your words <ArrowDown size={16} aria-hidden='true' />
          </a>
          <span className={styles.marginNote}>
            Less second-guessing.
            <br />
            More saying what you mean.
          </span>
        </section>
        <section
          id='writing-desk'
          className={styles.editor}
          aria-label='Text rewriting editor'
        >
          <div className={styles.editorTop}>
            <span>
              <span className={styles.tinyLogo}>
                <Feather size={15} aria-hidden='true' />
              </span>{' '}
              Your writing desk
            </span>
            <span className={styles.editorStatus}>
              {ready
                ? 'Ready to write'
                : 'Preview workspace · live AI setup pending'}
            </span>
          </div>
          <div className={styles.toneBar}>
            <span>Find your tone</span>
            <fieldset aria-label='Rewrite tone'>
              {tones.map((value) => (
                <button
                  type='button'
                  key={value}
                  aria-pressed={tone === value}
                  className={tone === value ? styles.activeTone : ''}
                  onClick={() => setTone(value)}
                >
                  {value}
                </button>
              ))}
            </fieldset>
          </div>
          <div className={styles.panes}>
            <div className={styles.inputPane}>
              <div className={styles.paneHeading}>
                <label htmlFor='draft'>YOUR DRAFT</label>
                <button
                  type='button'
                  onClick={reset}
                  disabled={isLoading || !text}
                  aria-label='Clear draft and result'
                >
                  <RotateCcw size={15} aria-hidden='true' />
                </button>
              </div>
              <textarea
                id='draft'
                value={text}
                maxLength={100}
                rows={7}
                onChange={(e) => setText(e.target.value)}
                placeholder='Start with a thought. A messy sentence. An email you’ve rewritten three times…'
                aria-describedby='draft-hint'
              />
              <div className={styles.inputBottom}>
                <span id='draft-hint'>{text.length} / 100 characters</span>
                <span>Guest draft</span>
              </div>
            </div>
            <div className={styles.outputPane}>
              <div className={styles.paneHeading}>
                <span>YOUR {tone.toUpperCase()} REWRITE</span>
                <span className={styles.aiTag}>
                  <Sparkles size={12} aria-hidden='true' /> AI ASSISTED
                </span>
              </div>
              {result ? (
                <div className={styles.result} aria-live='polite'>
                  <p>{result}</p>
                  <button type='button' className={styles.copy} onClick={copy}>
                    {copied ? (
                      <Check size={15} aria-hidden='true' />
                    ) : (
                      <Copy size={15} aria-hidden='true' />
                    )}
                    {copied ? 'Copied' : 'Copy rewrite'}
                  </button>
                </div>
              ) : (
                <div className={styles.empty}>
                  <span>
                    <Feather size={27} strokeWidth={1.3} aria-hidden='true' />
                  </span>
                  <h2>A little polish. A lot of you.</h2>
                  <p>
                    {isLoading
                      ? 'Finding the right words…'
                      : 'Your rewrite will appear here. Start with a draft and choose the tone that feels right.'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.editorBottom}>
            <p>
              <span /> Your voice, with a fresh perspective.
            </p>
            <button
              type='button'
              className={styles.rewrite}
              disabled={!text.trim() || isLoading}
              onClick={() => {
                setError('');
                setCompletion('');
                void complete(text);
              }}
            >
              {isLoading ? (
                <LoaderCircle
                  className={styles.spin}
                  size={16}
                  aria-hidden='true'
                />
              ) : (
                <Sparkles size={16} aria-hidden='true' />
              )}
              {isLoading ? 'Finding your words…' : 'Rewrite my text'}
              <ArrowRight size={16} aria-hidden='true' />
            </button>
          </div>
          {error && (
            <p className={styles.error} role='alert'>
              {error}
            </p>
          )}
        </section>
        <div className={styles.examples}>
          <span>A blank page? Try this:</span>
          {examples.map((example) => (
            <button
              type='button'
              key={example.label}
              disabled={isLoading}
              onClick={() => {
                setText(example.text);
                setCompletion('');
                setError('');
                document.getElementById('draft')?.focus();
              }}
            >
              <FileText size={14} aria-hidden='true' />
              {example.label}
              <ArrowUpRight size={12} aria-hidden='true' />
            </button>
          ))}
        </div>
        {!ready && (
          <p className={styles.setupNote}>
            <span>Good to know</span> This portfolio workspace is open to
            explore. Live rewrites and account features need service
            configuration; no AI output is simulated.
          </p>
        )}
        <section id='possibilities' className={styles.possibilities}>
          <div>
            <p className={styles.eyebrow}>
              SAME MESSAGE. A BETTER WAY TO SAY IT.
            </p>
            <h2>
              For the words
              <br />
              <em>that matter.</em>
            </h2>
          </div>
          <div className={styles.useCases}>
            {[
              [
                '01',
                'Send with confidence',
                'Emails, updates, and the follow-up you’ve been putting off.',
              ],
              [
                '02',
                'Keep your own voice',
                'Six tones to help you sound clearer, warmer, or more direct.',
              ],
              [
                '03',
                'Get back to your day',
                'Draft, refine, copy. A small pause that makes a difference.',
              ],
            ].map(([n, title, description]) => (
              <article key={n}>
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link href='/' className={styles.footerBrand}>
          texttips.
        </Link>
        <span>A thoughtful space for better words.</span>
        <div>
          <Link href='/privacy-policy'>Privacy</Link>
          <Link href='/terms-of-service'>Terms</Link>
          <a href='https://github.com/axay7021/fe-texttips'>
            Source <ArrowUpRight size={13} aria-hidden='true' />
          </a>
        </div>
      </footer>
    </div>
  );
}
