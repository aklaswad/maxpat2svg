{
    "patcher": {
        "fileversion": 1,
        "appversion": {
            "major": 8,
            "minor": 5,
            "revision": 5,
            "architecture": "x64",
            "modernui": 1
        },
        "classnamespace": "box",
        "rect": [
            85.0,
            104.0,
            640.0,
            480.0
        ],
        "bglocked": 0,
        "openinpresentation": 0,
        "default_fontsize": 12.0,
        "default_fontface": 0,
        "default_fontname": "Arial",
        "gridonopen": 1,
        "gridsize": [
            15.0,
            15.0
        ],
        "gridsnaponopen": 1,
        "objectsnaponopen": 1,
        "statusbarvisible": 2,
        "toolbarvisible": 1,
        "lefttoolbarpinned": 0,
        "toptoolbarpinned": 0,
        "righttoolbarpinned": 0,
        "bottomtoolbarpinned": 0,
        "toolbars_unpinned_last_save": 0,
        "tallnewobj": 0,
        "boxanimatetime": 200,
        "enablehscroll": 1,
        "enablevscroll": 1,
        "devicewidth": 0.0,
        "description": "",
        "digest": "",
        "tags": "",
        "style": "",
        "subpatcher_template": "",
        "assistshowspatchername": 0,
        "boxes": [
            {
                "box": {
                    "id": "obj-1",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        20,
                        200.0,
                        18.0
                    ],
                    "text": "button"
                }
            },
            {
                "box": {
                    "id": "obj-2",
                    "maxclass": "button",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        40,
                        24.0,
                        24.0
                    ],
                    "text": "button",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-3",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        74.0,
                        200.0,
                        18.0
                    ],
                    "text": "codebox"
                }
            },
            {
                "box": {
                    "id": "obj-4",
                    "maxclass": "codebox",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        94.0,
                        200.0,
                        200.0
                    ],
                    "text": "codebox",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-5",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        304.0,
                        200.0,
                        18.0
                    ],
                    "text": "codebox~"
                }
            },
            {
                "box": {
                    "id": "obj-6",
                    "maxclass": "codebox~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        324.0,
                        200.0,
                        200.0
                    ],
                    "text": "codebox~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-7",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        534.0,
                        200.0,
                        18.0
                    ],
                    "text": "dial"
                }
            },
            {
                "box": {
                    "id": "obj-8",
                    "maxclass": "dial",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        554.0,
                        40.0,
                        40.0
                    ],
                    "text": "dial",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-9",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        604.0,
                        200.0,
                        18.0
                    ],
                    "text": "ezadc~"
                }
            },
            {
                "box": {
                    "id": "obj-10",
                    "maxclass": "ezadc~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        624.0,
                        45.0,
                        45.0
                    ],
                    "text": "ezadc~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-11",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        679.0,
                        200.0,
                        18.0
                    ],
                    "text": "ezdac~"
                }
            },
            {
                "box": {
                    "id": "obj-12",
                    "maxclass": "ezdac~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        699.0,
                        45.0,
                        45.0
                    ],
                    "text": "ezdac~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-13",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        754.0,
                        200.0,
                        18.0
                    ],
                    "text": "filtergraph~"
                }
            },
            {
                "box": {
                    "id": "obj-14",
                    "maxclass": "filtergraph~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        774.0,
                        256.0,
                        128.0
                    ],
                    "text": "filtergraph~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-15",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        912.0,
                        200.0,
                        18.0
                    ],
                    "text": "function"
                }
            },
            {
                "box": {
                    "id": "obj-16",
                    "maxclass": "function",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        932.0,
                        200.0,
                        100.0
                    ],
                    "text": "function",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-17",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1042.0,
                        200.0,
                        18.0
                    ],
                    "text": "gain~"
                }
            },
            {
                "box": {
                    "id": "obj-18",
                    "maxclass": "gain~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1062.0,
                        22.0,
                        140.0
                    ],
                    "text": "gain~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-19",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1212.0,
                        200.0,
                        18.0
                    ],
                    "text": "gswitch"
                }
            },
            {
                "box": {
                    "id": "obj-20",
                    "maxclass": "gswitch",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1232.0,
                        41.0,
                        32.0
                    ],
                    "text": "gswitch",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-21",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1274.0,
                        200.0,
                        18.0
                    ],
                    "text": "gswitch2"
                }
            },
            {
                "box": {
                    "id": "obj-22",
                    "maxclass": "gswitch2",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1294.0,
                        39.0,
                        32.0
                    ],
                    "text": "gswitch2",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-23",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1336.0,
                        200.0,
                        18.0
                    ],
                    "text": "incdec"
                }
            },
            {
                "box": {
                    "id": "obj-24",
                    "maxclass": "incdec",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1356.0,
                        20.0,
                        24.0
                    ],
                    "text": "incdec",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-25",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1390.0,
                        200.0,
                        18.0
                    ],
                    "text": "kslider"
                }
            },
            {
                "box": {
                    "id": "obj-26",
                    "maxclass": "kslider",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1410.0,
                        336.0,
                        53.0
                    ],
                    "text": "kslider",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-27",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1473.0,
                        200.0,
                        18.0
                    ],
                    "text": "led"
                }
            },
            {
                "box": {
                    "id": "obj-28",
                    "maxclass": "led",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1493.0,
                        24.0,
                        24.0
                    ],
                    "text": "led",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-29",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1527.0,
                        200.0,
                        18.0
                    ],
                    "text": "levelmeter~"
                }
            },
            {
                "box": {
                    "id": "obj-30",
                    "maxclass": "levelmeter~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1547.0,
                        128.0,
                        64.0
                    ],
                    "text": "levelmeter~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-31",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1621.0,
                        200.0,
                        18.0
                    ],
                    "text": "matrixctrl"
                }
            },
            {
                "box": {
                    "id": "obj-32",
                    "maxclass": "matrixctrl",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1641.0,
                        130.0,
                        66.0
                    ],
                    "text": "matrixctrl",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-33",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1717.0,
                        200.0,
                        18.0
                    ],
                    "text": "meter~"
                }
            },
            {
                "box": {
                    "id": "obj-34",
                    "maxclass": "meter~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1737.0,
                        80.0,
                        13.0
                    ],
                    "text": "meter~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-35",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1760.0,
                        200.0,
                        18.0
                    ],
                    "text": "multislider"
                }
            },
            {
                "box": {
                    "id": "obj-36",
                    "maxclass": "multislider",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1780.0,
                        20.0,
                        140.0
                    ],
                    "text": "multislider",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-37",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1930.0,
                        200.0,
                        18.0
                    ],
                    "text": "nodes"
                }
            },
            {
                "box": {
                    "id": "obj-38",
                    "maxclass": "nodes",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        1950.0,
                        100.0,
                        100.0
                    ],
                    "text": "nodes",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-39",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2060.0,
                        200.0,
                        18.0
                    ],
                    "text": "nslider"
                }
            },
            {
                "box": {
                    "id": "obj-40",
                    "maxclass": "nslider",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2080.0,
                        75.0,
                        198.0
                    ],
                    "text": "nslider",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-41",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2288.0,
                        200.0,
                        18.0
                    ],
                    "text": "number~"
                }
            },
            {
                "box": {
                    "id": "obj-42",
                    "maxclass": "number~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2308.0,
                        56.0,
                        22.0
                    ],
                    "text": "number~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-43",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2340.0,
                        200.0,
                        18.0
                    ],
                    "text": "pictctrl"
                }
            },
            {
                "box": {
                    "id": "obj-44",
                    "maxclass": "pictctrl",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2360.0,
                        20.0,
                        20.0
                    ],
                    "text": "pictctrl",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-45",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2390.0,
                        200.0,
                        18.0
                    ],
                    "text": "pictslider"
                }
            },
            {
                "box": {
                    "id": "obj-46",
                    "maxclass": "pictslider",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2410.0,
                        100.0,
                        100.0
                    ],
                    "text": "pictslider",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-47",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2520.0,
                        200.0,
                        18.0
                    ],
                    "text": "playbar"
                }
            },
            {
                "box": {
                    "id": "obj-48",
                    "maxclass": "playbar",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2540.0,
                        320.0,
                        16.0
                    ],
                    "text": "playbar",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-49",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2566.0,
                        200.0,
                        18.0
                    ],
                    "text": "playlist~"
                }
            },
            {
                "box": {
                    "id": "obj-50",
                    "maxclass": "playlist~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2586.0,
                        150.0,
                        92.0
                    ],
                    "text": "playlist~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-51",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2688.0,
                        200.0,
                        18.0
                    ],
                    "text": "radiogroup"
                }
            },
            {
                "box": {
                    "id": "obj-52",
                    "maxclass": "radiogroup",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2708.0,
                        18.0,
                        34.0
                    ],
                    "text": "radiogroup",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-53",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2752.0,
                        200.0,
                        18.0
                    ],
                    "text": "rslider"
                }
            },
            {
                "box": {
                    "id": "obj-54",
                    "maxclass": "rslider",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2772.0,
                        20.0,
                        140.0
                    ],
                    "text": "rslider",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-55",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2922.0,
                        200.0,
                        18.0
                    ],
                    "text": "scope~"
                }
            },
            {
                "box": {
                    "id": "obj-56",
                    "maxclass": "scope~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        2942.0,
                        130.0,
                        130.0
                    ],
                    "text": "scope~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-57",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3082.0,
                        200.0,
                        18.0
                    ],
                    "text": "slider"
                }
            },
            {
                "box": {
                    "id": "obj-58",
                    "maxclass": "slider",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3102.0,
                        20.0,
                        140.0
                    ],
                    "text": "slider",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-59",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3252.0,
                        200.0,
                        18.0
                    ],
                    "text": "spectroscope~"
                }
            },
            {
                "box": {
                    "id": "obj-60",
                    "maxclass": "spectroscope~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3272.0,
                        300.0,
                        100.0
                    ],
                    "text": "spectroscope~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-61",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3382.0,
                        200.0,
                        18.0
                    ],
                    "text": "tab"
                }
            },
            {
                "box": {
                    "id": "obj-62",
                    "maxclass": "tab",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3402.0,
                        200.0,
                        24.0
                    ],
                    "text": "tab",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-63",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3436.0,
                        200.0,
                        18.0
                    ],
                    "text": "textbutton"
                }
            },
            {
                "box": {
                    "id": "obj-64",
                    "maxclass": "textbutton",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3456.0,
                        100.0,
                        20.0
                    ],
                    "text": "textbutton",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-65",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3486.0,
                        200.0,
                        18.0
                    ],
                    "text": "toggle"
                }
            },
            {
                "box": {
                    "id": "obj-66",
                    "maxclass": "toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3506.0,
                        24.0,
                        24.0
                    ],
                    "text": "toggle",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-67",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3540.0,
                        200.0,
                        18.0
                    ],
                    "text": "ubutton"
                }
            },
            {
                "box": {
                    "id": "obj-68",
                    "maxclass": "ubutton",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3560.0,
                        33.0,
                        42.0
                    ],
                    "text": "ubutton",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-69",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3612.0,
                        200.0,
                        18.0
                    ],
                    "text": "waveform~"
                }
            },
            {
                "box": {
                    "id": "obj-70",
                    "maxclass": "waveform~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3632.0,
                        256.0,
                        64.0
                    ],
                    "text": "waveform~",
                    "outlettype": [
                        ""
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-71",
                    "maxclass": "comment",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3706.0,
                        200.0,
                        18.0
                    ],
                    "text": "zplane~"
                }
            },
            {
                "box": {
                    "id": "obj-72",
                    "maxclass": "zplane~",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "patching_rect": [
                        20.0,
                        3726.0,
                        256.0,
                        256.0
                    ],
                    "text": "zplane~",
                    "outlettype": [
                        ""
                    ]
                }
            }
        ],
        "lines": [],
        "dependency_cache": [],
        "autosave": 0
    }
}