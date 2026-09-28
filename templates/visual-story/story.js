// 替換這個檔案的分鏡；不要為了新主題修改共用 docs/assets/story-reader/。
const story = {
  title: '把一個想法講清楚',
  label: '視覺解說 / 建立你的主題',
  pages: [
    {
      id: 'observe',
      section: '01 / 先觀察',
      title: '先讓讀者看到具體的情境',
      lead: '不要急著給定義。選一個讀者能辨認的例子，只呈現理解下一步所需的資訊。',
      art: '<div class="example-steps"><div>眼前的情境</div><div>值得注意的現象</div></div>',
      point: '這一頁只負責讓讀者知道：我們正在看什麼。',
      detail: '把這三頁替換成你的主題；頁數不固定，也不必每頁都用同一種圖。',
    },
    {
      id: 'predict',
      section: '02 / 想一想',
      title: '下一步，需要先補什麼？',
      lead: '預測題不是考試，而是讓讀者發現自己尚未掌握的關係。',
      art: '<div class="example-focus">看見現象 → 理解原因</div>',
      point: '讀者可以作答，也可以直接繼續閱讀。',
      question: {
        prompt: '只有結論，足以理解中間的過程嗎？',
        hideFuturePreviews: true,
        choices: [
          { value: 'steps', label: '還需要中間步驟', feedback: '對，把省略的變化拆開，讀者才有機會跟上。' },
          { value: 'more', label: '再加一些專有名詞', feedback: '名詞能命名概念，但不能代替原因與過程。' },
        ],
      },
    },
    {
      id: 'try',
      section: '03 / 自己試一次',
      title: '一次只揭露一個變化',
      lead: '按一下，看中間的過程。這個小互動示範如何掛載元件，以及離開頁面時清理。',
      art: '<div class="example-focus" data-result></div><button data-advance>看下一個變化</button>',
      previewArt: '<div class="example-steps"><div>觀察</div><div>原因</div><div>結果</div></div>',
      point: '每個主題可以使用不同的視覺語言，閱讀導覽保持一致。',
      mount(root, state) {
        const steps = ['先觀察現象', '補上造成變化的原因', '現在可以解釋結果'];
        state.step ??= 0;
        const output = root.querySelector('[data-result]');
        const button = root.querySelector('[data-advance]');
        const render = () => { output.textContent = steps[state.step]; };
        const advance = () => { state.step = (state.step + 1) % steps.length; render(); };
        button.addEventListener('click', advance);
        render();
        return () => button.removeEventListener('click', advance);
      },
    },
  ],
};
