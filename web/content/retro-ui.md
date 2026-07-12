---
title: 도트 UI 만들며 배운 것
date: 2026-04-28
tags: [개발, CSS]
summary: border-image 9-slice 로 창 테두리를 깨지지 않게 그리기.
---

도트 이미지를 CSS 로 다루려면 두 가지를 먼저 알아야 한다.

## image-rendering: pixelated

브라우저는 이미지를 확대할 때 부드럽게 보간한다.
도트 그림에는 재앙이라, 이 속성으로 보간을 꺼야 한다.

## border-image 9-slice

테두리 이미지를 아홉 조각으로 나눠, 모서리는 그대로 두고 변만 늘린다.
창 크기가 바뀌어도 모서리 도트가 찌그러지지 않는다.

```css
border: 12px solid transparent;
border-image: url("/textures/window-border.png") 12 / 12px stretch;
```
