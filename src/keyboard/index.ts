import React from 'react'

import keycode from 'keycode';
import { ownerDocument } from '../utils';
import * as O from 'fp-ts/lib/Option';

import { compareString } from 'macoolka-compare'
import { findDOMNode } from '../reactHelper'
import { pipe } from 'fp-ts/lib/pipeable'
/**
 * procss focus using up and down on keyboard
 * @param containNode root node
 * @param selectedNode select node in root node
 */
export const handleKeyEnterToClick = (containNode: O.Option<React.ReactInstance>, selectedNode: O.Option<Element>) =>
    (event: React.KeyboardEvent<any>) => {
        pipe(
            containNode,
            O.map(a => {
                const key = keycode(event as any);
                pipe(
                    O.fromPredicate(compareString.in(['space', 'enter']))(key),
                    O.chain(() => pipe(
                        findDOMNode(a),
                        O.map(container => {
                            const currentFocus: any = ownerDocument(container).activeElement;
                            if (
                                (!currentFocus || (currentFocus && !container.contains(currentFocus)))
                            ) {

                                if (O.isSome(selectedNode)) {
                                    const s = selectedNode.value as any;
                                    if (s && s.focus) {
                                        s.click();
                                    }

                                } else {
                                    const f: any = container.firstChild;
                                    if (f) {
                                        f.click();
                                    }
                                }
                            } else {
                                event.preventDefault();
                                currentFocus.click()

                            }
                        })
                    ))
                )




            })
        )


    };
export const handleKeyUpAndDown = (containNode: O.Option<React.ReactInstance>, selectedNode: O.Option<Element>) =>
    (event: React.KeyboardEvent<any>) => {
        pipe(
            containNode,
            O.map(a => {
                const key = keycode(event as any);
                pipe(
                    O.fromPredicate(compareString.in(['up', 'down']))(key),
                    O.chain(() => findDOMNode(a)),
                    O.map(container => {
                        const currentFocus: any = ownerDocument(container).activeElement;
                        if (
                            (!currentFocus || (currentFocus && !container.contains(currentFocus)))
                        ) {

                            if (O.isSome(selectedNode)) {
                                const s = selectedNode.value as any;
                                if (s && s.focus) {
                                    s.focus();
                                }

                            } else {
                                const f: any = container.firstChild;
                                if (f) {
                                    f.focus();
                                }
                            }
                        } else if (key === 'down') {
                            event.preventDefault();
                            if (currentFocus.nextElementSibling) {
                                currentFocus.nextElementSibling.focus();
                            }
                        } else if (key === 'up') {
                            event.preventDefault();
                            if (currentFocus.previousElementSibling) {
                                currentFocus.previousElementSibling.focus();
                            }
                        }
                    })
                )




            })
        )


    };