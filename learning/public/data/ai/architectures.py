"""07の小さな計算例。CNN・注意の重みは手設定。GANのみ学習を実行する。"""
import numpy as np

sigmoid=lambda x:1/(1+np.exp(-x))

# 1. CNN：二つのフィルター → ReLU → 最大値 → 二値分類。
filters=np.array([[[-1,1,-1]]*3,[[-1,-1,-1],[1,1,1],[-1,-1,-1]]])
cnn_results=[]
for name,vertical,column in [('中央の縦棒',True,3),('右の縦棒',True,5),('中央の横棒',False,3)]:
    image=np.zeros((7,7),dtype=int)
    if vertical: image[2:5,column]=1
    else: image[3,2:5]=1
    raw=np.array([[[np.sum(image[i:i+3,j:j+3]*f) for j in range(5)] for i in range(5)] for f in filters])
    feature_maps=np.maximum(raw,0)
    pooled=feature_maps.max(axis=(1,2))
    probability=float(sigmoid(2*pooled[0]-2*pooled[1]))
    cnn_results.append({'pooled':pooled.tolist(),'probability':probability})
    print(name,'取り出した値:',pooled,'縦棒の予測確率:',round(probability,6))

# 2. 自己注意：Q・K・Vを同じ仮のベクトルにした、1ヘッドの計算。
words=['猫','魚','食べる']
vectors=np.array([[1.,0.],[0.,1.],[1.,1.]])
attention_results=[]
for query_index in range(3):
    query=vectors[query_index]
    scores=vectors@query/np.sqrt(2)
    weights=np.exp(scores-scores.max());weights/=weights.sum()
    mixed=weights@vectors
    attention_results.append({'weights':weights.tolist(),'output':mixed.tolist()})
    print(words[query_index],'参照する割合:',np.round(weights,6),'混ぜた結果:',np.round(mixed,6))
# 続きを予測するときは、後ろの位置のscoresを-infにしてから同じ計算をする。

# 3. GAN：DとGを交互に学ぶ。種を固定した小さな数の例。
real=np.array([2.,3.,4.]);seeds=np.array([-1.,0.,1.])
a=-2.;w=0.;b=0.;rate=.2
gan_results=[]
for step in range(1001):
    if step in [0,1,100,1000]:
        gan_results.append({'step':step,'shift':float(a),'w':float(w),'b':float(b)})
        print('GAN',step,'回：生成した数',np.round(seeds+a,6),'Dのw,b',round(w,6),round(b,6))
    if step==1000: break
    # D：本物を1、生成を0とする二値交差エントロピー。
    # Gのaは固定したまま、Dのw,bを変える。
    fake=seeds+a
    dr=sigmoid(w*real+b)-1;df=sigmoid(w*fake+b)
    dw=np.mean(dr*real+df*fake)/2;db=np.mean(dr+df)/2
    w-=rate*dw;b-=rate*db
    # G：-log D(G(z))を小さくする。Dのw,bは固定する。
    da=np.mean((sigmoid(w*(seeds+a)+b)-1)*w)
    a-=rate*da
