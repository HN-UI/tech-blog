---
title: PyTorch DataLoader 뜯어보기
date: 2026-06-11
tags: [PyTorch]
summary: num_workers 와 collate_fn 이 실제로 하는 일.
---

`DataLoader` 는 그냥 배치를 만들어주는 도구처럼 보이지만,
안을 들여다보면 프로세스와 큐가 얽혀 있다.

## num_workers

`0` 이면 메인 프로세스가 직접 데이터를 읽는다.
`1` 이상이면 워커 프로세스를 그만큼 띄우고, 각자 읽은 샘플을 큐로 넘긴다.

## collate_fn

샘플 리스트를 배치 텐서로 묶는 함수다. 길이가 제각각인 시퀀스를 다룰 때는
직접 짜서 패딩을 넣어야 한다.
