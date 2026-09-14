import { Section,Sources } from './Common.jsx';
import { LocalPythonCommands } from './LocalPythonCommands.jsx';
import { CnnExplorer,ConvolutionIntro,AttentionExplorer,GanExplorer,SmallTable } from './ArchitectureExplorers.jsx';
import AutoencoderExample from './AutoencoderExample.jsx';
import PoolingAndDepth from './PoolingAndDepth.jsx';
import { RnnDiagram, AttentionDiagram, VectorTransformDiagram, TransformerDiagram, GanDiagram } from './SequenceAndGanDiagrams.jsx';

function Check({question,answer}){return <div className="note"><h3>ここまでを確かめる</h3><p>{question}</p><details><summary>答えと理由</summary><p>{answer}</p></details></div>;}

export default function AiArchitecturesLesson(){return <>
 <Section title="06のネットワークに、画像を入れるとしたら？">
  <p>06では、スイッチAとBの二つの数を入れ、ランプを点けるかどうかを答えさせました。重みを直すと、4通りの問題に答えられるようになりました。</p>
  <p>次は、<strong>手書きの数字の画像を入れたら、「3」「8」のように答えてほしい</strong>とします。ニューラルネットワークの基本は使えますが、入力は二つの数では足りません。</p>
  <p>画像を拡大すると、小さなマスが並んでいます。一つのマスが<strong>画素</strong>です。白を1、黒を0、その間の灰色を0.5などの数で表せば、画像も数の集まりにできます。例えば、7×7の画像なら49個の数を入力します。</p>
  <SmallTable head={['変えるところ','06の実験','数字の画像を読む例']} rows={[
   ['入力','スイッチ二つの0・1','各画素の明るさ'],
   ['答え','ランプを点けるか','0〜9のどの数字か'],
   ['学習','予測と正解を比べ、重みを直す','ここは同じ考え方を使う'],
  ]}/>
  <h3>入力を増やして、全部つなげばよい？</h3>
  <p>06のように、前の層と次の層を全部つなぐ方法を<strong>全結合</strong>と呼びます。画像にも使えますが、大きな画像ではつなぐ本数と重みが多くなります。また、同じ縦線でも、右へ移動すると別の入力欄に入ります。</p>
  <p><strong>近くの画素をまとめて「形」として調べ、同じ形なら、別の場所でも同じ見方を使えないでしょうか。</strong>この課題から、最初の工夫へ進みます。</p>
 </Section>
 <Section title="画像の部分を見る：畳み込みニューラルネットワーク">
  <p><strong>CNNは、畳み込みニューラルネットワークの略称です。</strong>英語のConvolutional Neural Networkの頭文字で、Convolutionが「畳み込み」を意味します。</p>
  <p>ここでいう<strong>畳み込み</strong>は、画像の小さな範囲に重みを掛けて足す計算です。例えば3×3の窓の中を計算し、窓をずらして次の場所も計算します。<strong>どの場所でも同じ重みを使う</strong>のがポイントです。この小さな重みの組を<strong>フィルター</strong>と呼びます。</p>
  <ConvolutionIntro/>
  <p>今の例では、窓の真ん中に白い縦線が入ると反応が大きくなりました。場所ごとの反応を並べた地図が<strong>特徴マップ</strong>です。「縦線がどこにあるか」という情報を、次の計算へ渡せます。</p>
  <h3>縦線が分かったら、数字も分かる？</h3>
  <p>縦線だけでは、何の数字かは決まりません。横線などを見る別のフィルターも使い、<strong>部分の特徴を組み合わせて、最後に数字を予測します。</strong>層を重ねると、前の層が取り出した特徴を、次の層の材料にできます。</p>
  <div className="architecture-sequence" aria-label="CNNによる画像分類"><p><strong>画像</strong><span>画素の明るさを入力する</span></p><p><strong>部分の形 → その組み合わせ</strong><span>畳み込みなどの計算で、特徴を取り出す</span></p><p><strong>何の数字かを予測</strong><span>取り出した特徴を使い、出力層で答えを出す</span></p></div>
  <p>学習では「3の画像なのに8と予測した」といった間違いから、重みを直します。<strong>フィルターの中の数も学習するので、役立つ形の見つけ方そのものが変わります。</strong>上の図だけは、仕組みを見せるために重みを人が決めています。</p>
  <details><summary>図で見る：プーリングと深層学習</summary><PoolingAndDepth/></details>
  <details><summary>計算も確かめる：縦棒・横棒を分類する小さなCNN</summary><CnnExplorer/></details>
  <Check question="CNNでは、画像の場所が変わるたびに、別のフィルターの重みを用意する？" answer="同じフィルターの重みを各位置で使います。別の場所も同じ見方で調べられるためです。その重み自体は、学習すると変わります。"/>
 </Section>
 <Section title="文章では、順番や離れた語の関係を使いたい">
  <p>今度は画像ではなく文章です。「猫が魚を食べる」と「魚が猫を食べる」は、語の顔ぶれが同じでも意味が違います。<strong>何があるかだけでなく、順番や語どうしの関係も必要です。</strong>文の長さも毎回同じとは限りません。</p>
  <h3>順番に読み、前の情報を次へ渡す</h3>
  <p>一つの方法は、「猫が」まで読んだ情報を、次の「魚を」を処理する計算へ渡し、さらに「食べる」へ渡すことです。このように途中の情報を引き継ぐ構造が、<strong>再帰型ニューラルネットワーク（Recurrent Neural Network：RNN）</strong>です。</p>
  <RnnDiagram/>
  <p>ただし、単純なRNNでは、長い文章の途中で、前の重要な情報を保ちにくくなることがあります。</p>
  <h3>必要なところを参照する：注意機構</h3>
  <p>「猫が、台所の隅に置かれた魚を、食べる」という文なら、「食べる」を考えるときに、離れた「猫」「魚」の情報も使いたい。そこで、<strong>今の部分とほかの部分を比べ、使う情報の割合を計算する</strong>仕組みを入れます。これが<strong>注意機構（attention）</strong>です。</p>
  <p>ここでの「猫」「魚」は、参照するという考え方の説明です。実際にどの語をどれだけ参照すると役立つかは、モデルが学習します。</p>
  <AttentionDiagram/>
  <h3>Transformerに進む前に、文章をどう数にする？</h3>
  <p>文字列のままでは、重みを掛けて足せません。まず文章を、語や語の一部などの<strong>トークン</strong>という単位に分け、それぞれをベクトルにします。図では読みやすさのため「猫」「魚」「食べる」を一単位にしています。</p>
  <p>一つの語を、一個の番号だけで表すのではなく、<strong>いくつもの数の並びで表し、その並びを計算で作り替えます。</strong>各成分に「動物らしさ」などの名前が最初から決まっているわけではなく、予測に役立つ表し方を学びます。</p>
  <VectorTransformDiagram/>
  <p><strong>Transformer（トランスフォーマー）</strong>は、このようなベクトルの変換と注意機構を組み合わせたニューラルネットワークの構造です。何を比較し、何を混ぜるのかを、順に見ましょう。</p>
  <TransformerDiagram/>
  <h3>何と比べて、学習するの？</h3>
  <p>文章の続きを予測させるなら、<strong>「猫が魚を」までを見せ、その後に実際に書かれていた「食べる」と答え合わせ</strong>できます。実際には、先ほどのトークンごとに予測します。</p>
  <p>予測と実際の続きを比べて重みを直すので、05・06の学習の基本は同じです。生成するときは、一つ続きを出し、それを入力に加えて、また次を予測します。</p>
  <details><summary>計算も確かめる：参照する割合は、どう求める？</summary><AttentionExplorer/></details>
  <Check question="文章の続きで学ぶとき、これから当てる部分を先に入力してよい？" answer="先に答えを見せると、続きを予測する練習になりません。これから当てる部分は隠して予測し、その後に答え合わせします。"/>
 </Section>
 <Section title="正解ラベルがない画像からも、学べる？">
  <p>手書き画像へ戻りましょう。これまでは「この画像は3」という正解を付けて、分類を練習する想定でした。でも、画像を集めただけなら、一枚ずつ正解を付ける作業が残っています。</p>
  <p><strong>正解の名前を付ける前に、画像の特徴を学ぶことはできないでしょうか。</strong>別に用意した正解ラベルを使わず、データの特徴やまとまりを学ぶのが<strong>教師なし学習</strong>です。ニューラルネットワークでもできます。</p>
  <h3>少ない数にまとめて、元の画像を描き直す</h3>
  <p>例えば、画像を少ない数で表し、その数だけを使って元の画像に近いものを作り直す練習をします。<strong>描き直すために、どんな手がかりを残せばよいか</strong>を学ぶわけです。</p>
  <p>この方法が<strong>オートエンコーダ（自己符号化器、Autoencoder：AE）</strong>です。画像を少ない数へまとめる部分が<strong>エンコーダ</strong>、そこから画像を復元する部分が<strong>デコーダ</strong>です。</p>
  <p>下は8×8の実際の手書き画像を使った例です。64個の明るさをいったん16個の数にまとめ、そこから64個の明るさを作り直しています。</p>
  <AutoencoderExample/>
  <h3>正解ラベルがないのに、何を「間違い」とする？</h3>
  <p><strong>元の画像と、復元した画像の違い</strong>を測れます。その違いが小さくなるよう、エンコーダとデコーダの重みを直します。「これは3」という名前がなくても、答え合わせの材料は元画像にあるのです。</p>
  <p>学習した途中の数は、画像の特徴として、似た画像を探すなどの用途に使えます。ただし、元に戻す練習だけで「3」という名前まで教えたことにはなりません。分類に使うなら、そのための学習と評価も必要です。</p>
  <details><summary>自己教師あり学習という呼び方もある</summary><p>元画像を復元する、文章の続きを当てるなど、データ自身からお手本を作る学習を<strong>自己教師あり学習</strong>と呼びます。オートエンコーダは教師なし学習の代表例として紹介され、このようにお手本の作り方に注目して説明されることもあります。「教師なし」は、目標も答え合わせもなく、勝手に学ぶという意味ではありません。</p></details>
  <Check question="復元した画像が元に似ていたら、その数字の名前も分かっている？" answer="そうとは言えません。練習したのは画像の形を戻すことで、数字の名前を答えることではありません。何を学習の目標にしたかを区別します。"/>
 </Section>
 <Section title="元の画像を戻すのでなく、新しい画像を作りたい">
  <p>オートエンコーダでは、元に戻す画像がありました。次は、<strong>元画像を指定せずに、手書きらしい画像を新しく作りたい</strong>とします。</p>
  <p>作り始めのきっかけに乱数を入れても、「この一枚だけが正解」という画像はありません。そこで、作った画像が実際の手書き画像と見分けられるかを、別のニューラルネットワークに調べさせます。</p>
  <h3>作る役と、見分ける役：GAN</h3>
  <p>この学ばせ方が<strong>敵対的生成ネットワーク（Generative Adversarial Network：GAN）</strong>です。画像を作る<strong>生成器（G）</strong>と、実際の画像か生成画像かを見分ける<strong>識別器（D）</strong>を使います。</p>
  <GanDiagram/>
  <ol className="exercise-list"><li><strong>まず、識別器を練習させる。</strong>実際の画像と、生成器が作った画像を渡す。出所は分かるので、判断が合ったかを比べられる。</li><li><strong>次に、生成器を練習させる。</strong>識別器を使って生成画像を評価し、実際の画像と見分けられにくくなるよう、生成器の重みを直す。その回の識別器の重みは固定する。</li><li><strong>この二つを交互に繰り返す。</strong>生成器の作り方が変わったら、識別器も練習し直す。</li></ol>
  <p>「敵対的」は、生成器が見分けられにくくし、識別器は見分けようとする関係を表します。ここでも学習は重みの調整ですが、<strong>一枚の正解画像の代わりに、識別器の判断を手がかりにする</strong>点が違います。</p>
  <p>この基本形では、手書き画像に数字のラベルは要りません。識別器の答え合わせには「実際のデータ／生成したデータ」という出所を使います。</p>
  <details><summary>計算も確かめる：二つの役を、別々に学習させる</summary><GanExplorer/></details>
  <p>学習後は生成器で画像を作れます。同じような画像ばかり出ていないか、練習した画像をそのまま再現していないかも調べます。GANは、新しい画像を作る方法の一つです。</p>
 </Section>
 <Section title="何に困って、どこを変えたかを整理する">
  <SmallTable head={['今回の課題','加えた工夫','出てきた名前']} rows={[
   ['画像の部分の形を、各場所で調べたい','近くの画素へ、同じ重みを使う','畳み込みニューラルネットワーク（CNN）'],
   ['文章の順番や、語の関係を使いたい','順に情報を渡す／ほかの部分を参照する','再帰型ニューラルネットワーク（RNN）／Transformer'],
   ['正解ラベルなしで画像の特徴を学びたい','少ない数から元の画像を復元する','オートエンコーダ'],
   ['新しい画像を作りたい','作る役と見分ける役で学ぶ','敵対的生成ネットワーク（GAN）'],
  ]}/>
  <p><strong>CNNは計算の構造、教師あり・教師なしは学び方の区分です。</strong>例えば、CNNを使ったオートエンコーダで、ラベルのない画像を学ぶこともできます。「教師なしとCNNのどちらか一つ」という選び方にはなりません。</p>
  <p>新しい方法でも、05で見た過学習は起こり得ます。今回の目的に役立ったかを、学習に使わないデータで確かめます。</p>
  <details><summary>補足の計算を、ローカルのPythonで実行する</summary><p>各節の「計算も確かめる」に対応する小さな練習です。CNNと注意機構は手で設定した数による計算例、GANは二つの小さなモデルを実際に更新する例です。</p><div className="download-row"><a href={`${import.meta.env.BASE_URL}data/ai/architectures.py`} download>CNN・注意機構・GANのPythonコード ↓</a></div><LocalPythonCommands packages="numpy" filename="architectures.py"/></details>
  <p>では、こうしたモデルを毎回、自分のデータだけで一から学習するのでしょうか。次の08では、<strong>既に学習したモデルを使い、自分の課題へ合わせる方法</strong>に進みます。</p>
 </Section>
 <Sources links={[
  ['Stanford CS231n：CNNと畳み込み','https://cs231n.github.io/convolutional-networks/'],
  ['PyTorch：RNNと隠れ状態','https://docs.pytorch.org/docs/stable/generated/torch.nn.RNN.html'],
  ['Transformerの原論文：系列の扱いと注意機構','https://arxiv.org/html/1706.03762v7'],
  ['Deep Learning：オートエンコーダ','https://www.deeplearningbook.org/contents/autoencoders.html'],
  ['TensorFlow：元画像と復元画像を比べる学習','https://www.tensorflow.org/tutorials/generative/autoencoder'],
  ['scikit-learn：手書き数字の画像データ','https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html'],
  ['GANの原論文：生成器と識別器の学習','https://arxiv.org/html/1406.2661v1'],
 ]}/>
 </>;}
